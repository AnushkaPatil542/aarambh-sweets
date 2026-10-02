
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const multer = require("multer");
const crypto = require("crypto");
const { v2: cloudinary } = require("cloudinary");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Image upload configuration: keep image in memory temporarily.
// Maximum upload size: 5 MB.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, PNG, and WebP images are allowed."));
    }

    cb(null, true);
  },
});

// Verify actual image file signatures, not just its filename/MIME type.
function getImageFormat(buffer) {
  if (
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "jpg";
  }

  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    )
  ) {
    return "png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  return null;
}

// Generate a signed URL for an authenticated Cloudinary image.
// Only call this for approved images or inside protected admin routes.
function getImageUrl(publicId, format) {
  return cloudinary.url(publicId, {
    secure: true,
    type: "authenticated",
    sign_url: true,
    resource_type: "image",
    format,
  });
}

// Protect owner-only moderation endpoints.
function requireGalleryAdmin(req, res, next) {
  const expectedToken = process.env.GALLERY_ADMIN_TOKEN;
  const authorization = req.headers.authorization || "";
  const suppliedToken = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : "";

  if (!expectedToken) {
    return res.status(503).json({
      message: "Gallery moderation is not configured.",
    });
  }

  const expected = Buffer.from(expectedToken);
  const supplied = Buffer.from(suppliedToken);

  if (
    !suppliedToken ||
    expected.length !== supplied.length ||
    !crypto.timingSafeEqual(expected, supplied)
  ) {
    return res.status(401).json({
      message: "Unauthorized.",
    });
  }

  next();
}

// Test API
app.get("/", (req, res) => {
  res.send("Aarambh Sweets API is running!");
});

// ==================== CUSTOMER REVIEWS ====================

// Get all customer reviews
app.get("/api/reviews", (req, res) => {
  const sql = `
    SELECT id, customer_name, rating, comment, created_at
    FROM reviews
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching reviews:", err.message);
      return res.status(500).json({
        message: "Failed to fetch reviews",
      });
    }

    res.json(results);
  });
});

// Add a customer review
app.post("/api/reviews", (req, res) => {
  const { customer_name, rating, comment } = req.body;

  const name =
    typeof customer_name === "string" ? customer_name.trim() : "";
  const feedback =
    typeof comment === "string" ? comment.trim() : "";
  const stars = Number(rating);

  if (
    !name ||
    name.length > 100 ||
    !Number.isInteger(stars) ||
    stars < 1 ||
    stars > 5 ||
    !feedback ||
    feedback.length > 2000
  ) {
    return res.status(400).json({
      message:
        "Please provide a valid name, rating (1–5), and comment (max 2000 characters).",
    });
  }

  const sql = `
    INSERT INTO reviews (customer_name, rating, comment)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [name, stars, feedback], (err, result) => {
    if (err) {
      console.error("Error saving review:", err.message);
      return res.status(500).json({
        message: "Failed to save review",
      });
    }

    res.status(201).json({
      message: "Review submitted successfully!",
      id: result.insertId,
    });
  });
});

// ==================== CUSTOMER PHOTO GALLERY ====================

// Submit a photo. New submissions remain private and PENDING.
app.post("/api/gallery", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "Please select a photo to upload.",
    });
  }

  const format = getImageFormat(req.file.buffer);

  if (!format) {
    return res.status(400).json({
      message: "Invalid image file. Upload a JPG, PNG, or WebP image.",
    });
  }

  const caption =
    typeof req.body.caption === "string"
      ? req.body.caption.trim()
      : "";

  if (caption.length > 500) {
    return res.status(400).json({
      message: "Caption must be 500 characters or fewer.",
    });
  }

  const publicId =
    `aarambh_customer_photos/${crypto.randomUUID()}`;

  const stream = cloudinary.uploader.upload_stream(
    {
      public_id: publicId,
      resource_type: "image",
      type: "authenticated",
      allowed_formats: ["jpg", "png", "webp"],
    },
    (error, result) => {
      if (error || !result) {
        console.error("Cloudinary upload failed:", error?.message);

        return res.status(500).json({
          message: "Photo upload failed. Please try again.",
        });
      }

      const sql = `
        INSERT INTO customer_photos
          (image_public_id, image_format, caption, status)
        VALUES (?, ?, ?, 'PENDING')
      `;

      db.query(
        sql,
        [result.public_id, result.format || format, caption || null],
        (dbError, dbResult) => {
          if (dbError) {
            console.error("Saving gallery photo failed:", dbError.message);

            // Best-effort cleanup if the database insert fails.
            cloudinary.uploader.destroy(
              result.public_id,
              { resource_type: "image", type: "authenticated" },
              (cleanupError) => {
                if (cleanupError) {
                  console.error(
                    "Private image cleanup failed:",
                    cleanupError.message
                  );
                }
              }
            );

            return res.status(500).json({
              message: "Could not save photo submission.",
            });
          }

          return res.status(201).json({
            message:
              "Photo submitted successfully! It will appear after approval.",
            id: dbResult.insertId,
          });
        }
      );
    }
  );

  stream.end(req.file.buffer);
});

// Return approved photos only.
// Pending and rejected image IDs are never returned publicly.
app.get("/api/gallery", (req, res) => {
  const sql = `
    SELECT id, image_public_id, image_format, caption, created_at
    FROM customer_photos
    WHERE status = 'APPROVED'
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Fetching gallery failed:", err.message);
      return res.status(500).json({
        message: "Failed to load gallery.",
      });
    }

    const photos = results.map((photo) => ({
      id: photo.id,
      imageUrl: getImageUrl(
        photo.image_public_id,
        photo.image_format
      ),
      caption: photo.caption,
      created_at: photo.created_at,
    }));

    res.json(photos);
  });
});

// ==================== OWNER MODERATION ====================

// Get pending submissions and their image URLs.
// Requires: Authorization: Bearer YOUR_GALLERY_ADMIN_TOKEN
app.get(
  "/api/admin/gallery/pending",
  requireGalleryAdmin,
  (req, res) => {
    const sql = `
      SELECT id, image_public_id, image_format, caption, created_at
      FROM customer_photos
      WHERE status = 'PENDING'
      ORDER BY created_at ASC
    `;

    db.query(sql, (err, results) => {
      if (err) {
        console.error("Fetching pending photos failed:", err.message);
        return res.status(500).json({
          message: "Failed to fetch pending photos.",
        });
      }

      const photos = results.map((photo) => ({
        id: photo.id,
        imageUrl: getImageUrl(
          photo.image_public_id,
          photo.image_format
        ),
        caption: photo.caption,
        created_at: photo.created_at,
      }));

      res.json(photos);
    });
  }
);

// Approve or reject a pending submission.
app.patch(
  "/api/admin/gallery/:id",
  requireGalleryAdmin,
  (req, res) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (
      !Number.isSafeInteger(id) ||
      id < 1 ||
      !["APPROVED", "REJECTED"].includes(status)
    ) {
      return res.status(400).json({
        message: "Provide a valid photo ID and APPROVED or REJECTED status.",
      });
    }

    const sql = `
      UPDATE customer_photos
      SET status = ?, reviewed_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'PENDING'
    `;

    db.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error("Moderating photo failed:", err.message);
        return res.status(500).json({
          message: "Failed to update photo status.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Pending photo not found.",
        });
      }

      res.json({
        message: `Photo ${status.toLowerCase()} successfully.`,
        id,
        status,
      });
    });
  }
);

// Handle upload validation errors.
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller."
        : "Please upload only one image.";

    return res.status(400).json({ message });
  }

  if (err) {
    return res.status(400).json({
      message: err.message || "Request failed.",
    });
  }

  next();
});

// Start server only after MySQL connects.
db.connect((err) => {
  if (err) {
    console.error("MySQL connection failed:", err.message);
    return;
  }

  console.log("MySQL connected successfully!");

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
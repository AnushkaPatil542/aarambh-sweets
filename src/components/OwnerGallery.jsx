
import { useState } from "react";

const API_URL = "https://aarambh-sweets.onrender.com";

function OwnerGallery() {
  const [token, setToken] = useState("");
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // Fetch photos waiting for approval
  const loadPendingPhotos = async () => {
    if (!token.trim()) {
      setError("Please enter your admin token.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/gallery/pending`,
        {
          headers: {
            Authorization: `Bearer ${token.trim()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Unable to load photos. Check your token.");
      }

      setPhotos(Array.isArray(data) ? data : data.photos || []);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  // Approve or reject a photo
  const updatePhotoStatus = async (id, status) => {
    if (
      status === "REJECTED" &&
      !window.confirm("Are you sure you want to reject this photo?")
    ) {
      return;
    }

    setActionId(id);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/gallery/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.trim()}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || "Could not update photo status.");
      }

      setPhotos((currentPhotos) =>
        currentPhotos.filter((photo) => photo.id !== id)
      );

      setMessage(
        status === "APPROVED"
          ? "Photo approved successfully!"
          : "Photo rejected successfully!"
      );
    } catch (err) {
      setError(err.message || "Could not update photo status.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <a href="/" style={styles.backLink}>
          ← Back to Aarambh Sweets
        </a>

        <h1 style={styles.heading}>Owner Gallery Approval</h1>
        <p style={styles.subtitle}>
          Review customer photos before they appear in the public gallery.
        </p>

        <section style={styles.loginBox}>
          <label htmlFor="admin-token" style={styles.label}>
            Admin token
          </label>

          <input
            id="admin-token"
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your GALLERY_ADMIN_TOKEN"
            autoComplete="off"
            style={styles.input}
          />

          <button
            onClick={loadPendingPhotos}
            disabled={loading}
            style={styles.primaryButton}
          >
            {loading ? "Loading..." : "Load Pending Photos"}
          </button>
        </section>

        {error && (
          <p role="alert" style={styles.error}>
            {error}
          </p>
        )}

        {message && (
          <p role="status" style={styles.success}>
            {message}
          </p>
        )}

        <h2 style={styles.subheading}>
          Pending Photos ({photos.length})
        </h2>

        {photos.length === 0 && !loading && !error && (
          <p style={styles.empty}>
            No pending photos to review. Enter your token and load the list.
          </p>
        )}

        <div style={styles.grid}>
          {photos.map((photo) => (
            <article key={photo.id} style={styles.card}>
              <img
                src={photo.imageUrl}
                alt={photo.caption || "Customer-submitted photo"}
                style={styles.image}
              />

              <div style={styles.cardContent}>
                <p style={styles.caption}>
                  {photo.caption || "No caption provided"}
                </p>

                <p style={styles.photoId}>Photo ID: {photo.id}</p>

                <div style={styles.actions}>
                  <button
                    onClick={() =>
                      updatePhotoStatus(photo.id, "APPROVED")
                    }
                    disabled={actionId !== null}
                    style={styles.approveButton}
                  >
                    {actionId === photo.id ? "Please wait..." : "Approve"}
                  </button>

                  <button
                    onClick={() =>
                      updatePhotoStatus(photo.id, "REJECTED")
                    }
                    disabled={actionId !== null}
                    style={styles.rejectButton}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#faf7f0",
    padding: "32px 16px",
    color: "#352719",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  backLink: {
    color: "#79552c",
    textDecoration: "none",
  },
  heading: {
    marginTop: "28px",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#766b5e",
    lineHeight: 1.6,
  },
  loginBox: {
    background: "#fff",
    border: "1px solid #e8dfd0",
    borderRadius: "12px",
    padding: "20px",
    marginTop: "24px",
    display: "grid",
    gap: "12px",
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "12px",
    border: "1px solid #d7cabb",
    borderRadius: "7px",
    fontSize: "15px",
  },
  primaryButton: {
    padding: "12px 16px",
    background: "#704421",
    color: "#fff",
    border: "none",
    borderRadius: "7px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  subheading: {
    marginTop: "32px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "#fff",
    border: "1px solid #e8dfd0",
    borderRadius: "12px",
    overflow: "hidden",
  },
 image: {
  width: "100%",
  height: "260px",
  objectFit: "contain",
  backgroundColor: "#f3eee5",
  display: "block",
},
  cardContent: {
    padding: "16px",
  },
  caption: {
    overflowWrap: "anywhere",
  },
  photoId: {
    fontSize: "13px",
    color: "#766b5e",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  },
  approveButton: {
    flex: 1,
    padding: "10px",
    background: "#247744",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  rejectButton: {
    flex: 1,
    padding: "10px",
    background: "#b93832",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    color: "#b42318",
    background: "#fff0ee",
    padding: "12px",
    borderRadius: "7px",
  },
  success: {
    color: "#176534",
    background: "#eaf7ee",
    padding: "12px",
    borderRadius: "7px",
  },
  empty: {
    color: "#766b5e",
    padding: "20px 0",
  },
};

export default OwnerGallery;
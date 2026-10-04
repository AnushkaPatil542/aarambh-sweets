import { useEffect, useState } from "react";

const API_URL = "https://aarambh-sweets.onrender.com/api/gallery";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Fetch approved photos from the backend
  const fetchPhotos = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("फोटो लोड करता आले नाहीत.");
      }

      const data = await response.json();
      setPhotos(data);
    } catch (err) {
      setError(err.message || "गॅलरी लोड करता आली नाही.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Submit a customer photo for approval
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!photo) {
      setError("कृपया अपलोड करण्यासाठी फोटो निवडा.");
      return;
    }

    if (photo.size > 5 * 1024 * 1024) {
      setError("फोटोचा आकार 5 MB पेक्षा कमी असावा.");
      return;
    }

    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("caption", caption);

    try {
      setUploading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "फोटो अपलोड करता आला नाही.");
      }

      setMessage("धन्यवाद! तुमचा फोटो मिळाला आहे.");

      setPhoto(null);
      setCaption("");

      // Reset the file input
      event.target.reset();
    } catch (err) {
      setError(err.message || "काहीतरी चूक झाली. पुन्हा प्रयत्न करा.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="gallery" id="gallery">
      <div className="section-heading">
        <p>आमचे ग्राहक, त्यांच्या आठवणी</p>

        <h2>
          तुमच्या आनंदाचे क्षण,
          <br />
          आरंभसोबत!
        </h2>

        <span>
          आरंभ स्वीट्ससोबतचे तुमचे खास क्षण आमच्यासोबत शेअर करा.
        </span>
      </div>

      {/* Customer photo submission form */}
      <div className="gallery-upload">
        <h3>तुमचा फोटो शेअर करा</h3>

        <p>
          फोटो निवडा आणि हवे असल्यास छोटीशी माहिती लिहा.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="gallery-photo">
            तुमचा फोटो
          </label>

          <input
            id="gallery-photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) =>
              setPhoto(event.target.files?.[0] || null)
            }
            required
          />

          <label htmlFor="gallery-caption">
            कॅप्शन (Optional)
          </label>

          <textarea
            id="gallery-caption"
            value={caption}
            onChange={(event) => setCaption(event.target.value)}
            placeholder="तुमचा अनुभव लिहा..."
            maxLength={500}
            rows={3}
          />

          {message && (
            <p className="gallery-message" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="gallery-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={uploading}>
            {uploading
              ? "फोटो अपलोड होत आहे..."
              : "फोटो शेअर करा"}
          </button>
        </form>
      </div>

      {/* Public gallery: backend returns approved photos only */}
      <div className="gallery-grid">
        {loading && <p>गॅलरी लोड होत आहे...</p>}

        {!loading && !error && photos.length === 0 && (
          <p>
            अजून ग्राहकांचे फोटो उपलब्ध नाहीत.
            तुमचा फोटो शेअर करणारे पहिले ग्राहक व्हा!
          </p>
        )}

        {photos.map((item) => (
          <article className="gallery-item" key={item.id}>
            <img
              src={item.imageUrl}
              alt={
                item.caption ||
                "आरंभ स्वीट्स ग्राहकाचा फोटो"
              }
              loading="lazy"
            />

            {item.caption && (
              <div className="gallery-overlay">
                <p>{item.caption}</p>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default Gallery;
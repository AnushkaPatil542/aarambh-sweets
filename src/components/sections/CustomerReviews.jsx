import { useEffect, useState } from "react";

const API_URL = "https://aarambh-sweets.onrender.com/api/reviews";

function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchReviews() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Reviews could not be loaded.");
      }

      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(
        "अभिप्राय लोड करता आले नाहीत. कृपया पुन्हा प्रयत्न करा."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim() || !rating || !comment.trim()) {
      setError("कृपया नाव, रेटिंग आणि अभिप्राय भरा.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_name: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "अभिप्राय पाठवता आला नाही."
        );
      }

      setName("");
      setRating(0);
      setComment("");
      setMessage(
        "धन्यवाद! तुमचा अभिप्राय यशस्वीरीत्या नोंदवला गेला."
      );

      await fetchReviews();
    } catch (err) {
      setError(
        err.message ||
          "काहीतरी चूक झाली. कृपया पुन्हा प्रयत्न करा."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce(
            (sum, review) => sum + Number(review.rating),
            0
          ) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <section className="reviews" id="reviews">
      <div className="section-heading">
        <p>ग्राहकांचे अभिप्राय</p>

        <h2>
          तुमचा विश्वास,
          <br />
          आमची खरी कमाई.
        </h2>

        <span>
          आमच्या चवीचा अनुभव घेतलेल्या
          ग्राहकांचे मनापासून आभार.
        </span>
      </div>

      {reviews.length > 0 && (
        <div className="reviews-summary">
          <span className="summary-stars">★</span>

          <strong>{averageRating} / 5</strong>

          <span>
            {reviews.length} ग्राहक अभिप्राय
          </span>
        </div>
      )}

      <div className="review-form-card">
        <h3>तुमचा अभिप्राय द्या</h3>

        <p>आमच्या मिठाईचा अनुभव कसा होता?</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="review-name">
            तुमचे नाव
          </label>

          <input
            id="review-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="तुमचे नाव लिहा"
            maxLength={100}
            required
          />

          <label htmlFor="review-rating">
            तुमचे रेटिंग
          </label>

          <div
            id="review-rating"
            className="rating-picker"
            aria-label="रेटिंग निवडा"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`rating-star ${
                  star <= rating ? "selected" : ""
                }`}
                onClick={() => setRating(star)}
                aria-label={`${star} पैकी ${star} स्टार`}
                aria-pressed={rating === star}
              >
                ★
              </button>
            ))}
          </div>

          <label htmlFor="review-comment">
            तुमचा अनुभव
          </label>

          <textarea
            id="review-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="तुमचा अनुभव येथे लिहा..."
            maxLength={2000}
            rows={4}
            required
          />

          {message && (
            <p className="review-success" role="status">
              {message}
            </p>
          )}

          {error && (
            <p className="review-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="review-submit"
            disabled={submitting}
          >
            {submitting ? "पाठवत आहे..." : "अभिप्राय पाठवा"}
          </button>
        </form>
      </div>

      <div className="reviews-list">
        <h3>ग्राहकांचे अनुभव</h3>

        {loading ? (
          <p className="reviews-empty">
            अभिप्राय लोड होत आहेत...
          </p>
        ) : reviews.length === 0 ? (
          <p className="reviews-empty">
            अजून अभिप्राय उपलब्ध नाहीत.
            तुमचा अनुभव सर्वात आधी शेअर करा!
          </p>
        ) : (
          <div className="reviews-grid">
            {reviews.map((review) => (
              <article
                className="review-card"
                key={review.id}
              >
                <div
                  className="review-stars"
                  aria-label={`${review.rating} पैकी ${review.rating} स्टार`}
                >
                  {"★".repeat(Number(review.rating))}

                  <span className="empty-stars">
                    {"★".repeat(5 - Number(review.rating))}
                  </span>
                </div>

                <p className="review-text">
                  {review.comment}
                </p>

                <p className="review-name">
                  — {review.customer_name}
                </p>

                <time className="review-date">
                  {new Date(
                    review.created_at
                  ).toLocaleDateString("mr-IN")}
                </time>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default CustomerReviews;
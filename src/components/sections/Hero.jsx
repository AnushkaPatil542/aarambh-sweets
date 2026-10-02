
function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-content">

        <p className="hero-small-text">
          घरगुती पद्धतीने तयार केलेले
        </p>

        <h1>
          आरंभ स्वीट्स
        </h1>

        <h2>
          घरच्या चवीचा,
          <br />
          शुद्धतेचा आरंभ.
        </h2>

        <p className="hero-description">
          शुद्ध आणि नैसर्गिक दुग्धजन्य पदार्थ,
          घरगुती पद्धतीने प्रेमाने तयार केलेले.
        </p>

        <div className="hero-buttons">
          <a
            href="https://wa.me/9766106849"
            target="_blank"
            rel="noreferrer"
            className="primary-btn"
          >
            WhatsApp वर ऑर्डर करा
          </a>

          <a
            href="#products"
            className="secondary-btn"
          >
            आमची उत्पादने पाहा
          </a>
        </div>

      </div>
    </section>
  );
}

export default Hero;


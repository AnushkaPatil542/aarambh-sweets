function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">

        {/* Brand */}
        <div className="footer-brand">
          <h2>आरंभ</h2>
          <p>SWEETS</p>

          <span>
            घरच्या चवीचा, शुद्धतेचा आरंभ.
          </span>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>

          <a href="#home">Home</a>
          <a href="#products">Products</a>
          <a href="#story">About Us</a>
          <a href="#gallery">Gallery</a>
          <a href="#contact">Contact</a>
        </div>

        {/* Contact */}
        <div className="footer-contact">
          <h3>संपर्क</h3>

          <p>
            💬 ऑर्डर आणि चौकशीसाठी WhatsApp करा.
          </p>

          <a
            href="https://wa.me/919766106849"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp वर संपर्क करा
          </a>
        </div>

      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>
          © 2026 आरंभ स्वीट्स. सर्व हक्क राखीव.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
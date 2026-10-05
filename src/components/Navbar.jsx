
function Navbar() {
  return (
    <nav className="navbar">
      
      <a href="#home" className="logo">
        <span>आरंभ</span>
        <small>SWEETS</small>
        <em>FSSAI Lic. No.: 21523087006104</em>
      </a>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#products">Products</a>
        <a href="#story">About Us</a>
        <a href="#gallery">Gallery</a>
        <a href="#contact">Contact</a>
      </div>

      <a
        href="https://wa.me/919766106849"
        target="_blank"
        rel="noreferrer"
        className="whatsapp-btn"
      >
        WhatsApp वर ऑर्डर करा
      </a>

    </nav>
  );
}

export default Navbar;


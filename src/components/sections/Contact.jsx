function Contact() {
  return (
    <section className="contact" id="contact">

      <div className="contact-content">

        <div className="contact-heading">
          <p>आमच्याशी संपर्क करा</p>

          <h2>
            चवीची सुरुवात
            <br />
            एका मेसेजपासून.
          </h2>

          <span>
            पेढा, खवा किंवा बासुंदी हवी आहे?
            आम्हाला WhatsApp वर मेसेज करा.
          </span>
        </div>

        <div className="contact-details">

          <div className="contact-card">
            <div className="contact-icon">📍</div>

            <div>
              <h3>पत्ता</h3>
              <p>
               📍 किर्लोस्करवाडी-बुर्ली रोड, बुर्ली (कॅनॉल जवळ)
              </p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon">📞</div>

            <div>
              <h3>फोन</h3>
              <p>
                9766106849
                
              </p>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon">💬</div>

            <div>
              <h3>WhatsApp</h3>
              <p>
                ऑर्डर आणि चौकशीसाठी WhatsApp करा.
              </p>
            </div>
          </div>

        </div>

        <div className="contact-action">

          <p>
            🏠 आम्ही घरगुती पद्धतीने काम करतो.
            भेट देण्यापूर्वी कृपया फोन किंवा WhatsApp वर संपर्क करा.
          </p>

          <a
            href="https://wa.me/9766106849"
            target="_blank"
            rel="noreferrer"
            className="contact-btn"
          >
            💬 WhatsApp वर ऑर्डर करा
          </a>

        </div>

      </div>

    </section>
  );
}

export default Contact;

const products = [
  {
    id: "pedha",
    name: "पेढा",
    image: "/pedha.jpg",
    alt: "आरंभ पेढा",
    tag: "आमची खासियत",
    description:
      "घरगुती पद्धतीने तयार केलेला शुद्ध आणि स्वादिष्ट पेढा.",
    availability: "उपलब्ध: 250g | 500g | 1kg",
  },
  {
    id: "modak",
    name: "मोदक पेढा",
    image: "/modak.jpg",
    alt: "आरंभ मोदक",
    tag: "सणासुदीची खासियत",
    description:
      "प्रेमाने तयार केलेले स्वादिष्ट मोदक, सण आणि खास प्रसंगांसाठी.",
    availability: "उपलब्धता व प्रकारासाठी संपर्क करा",
  },
  {
    id: "masale-dudh",
    name: "मसाले दूध",
    image: "/masale-dudh.jpg",
    alt: "आरंभ मसाले दूध",
    tag: "दुग्धपदार्थ",
    description:
      "दुधापासून तयार केलेले स्वादिष्ट मसाले दूध.",
    availability: "उपलब्धता: संपर्क करून विचारा",
  },
  {
    id: "barfi",
    name: "बर्फी",
    image: "/barfi.jpg",
    alt: "आरंभ बर्फी",
    tag: "गोड खासियत",
    description:
      "गोड खाण्याची इच्छा पूर्ण करणारी स्वादिष्ट बर्फी.",
    availability: "उपलब्धता व प्रकारासाठी संपर्क करा",
  },
  {
    id: "khoya",
    name: "खवा",
    image: "/khoya.jpg",
    alt: "आरंभ खवा",
    tag: "ऑर्डरनुसार",
    description:
      "ताज्या दुधापासून तयार केलेला घरगुती आणि शुद्ध खवा.",
    availability: "उपलब्ध: ऑर्डरनुसार",
  },
  {
    id: "basundi",
    name: "बासुंदी",
    image: "/basundi.jpg",
    alt: "आरंभ बासुंदी",
    tag: "ऑर्डरनुसार",
    description:
      "ताज्या दुधापासून बनवलेली गोड आणि स्वादिष्ट बासुंदी.",
    availability: "उपलब्ध: ऑर्डरनुसार",
  },
];

function Products() {
  return (
    <section className="products" id="products">
      <div className="section-heading">
        <p>आमची उत्पादने</p>

        <h2>
          शुद्धतेची चव,
          <br />
          आरंभची खासियत.
        </h2>

        <span>
          ताजे, घरगुती आणि प्रेमाने तयार केलेले
          आमचे खास दुग्धजन्य पदार्थ.
        </span>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div className="product-image">
              <img
                src={product.image}
                alt={product.alt}
                loading="lazy"
              />
            </div>

            <div className="product-content">
              <p className="product-tag">{product.tag}</p>

              <h3>{product.name}</h3>

              <p>{product.description}</p>

              <span className="product-availability">
                {product.availability}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Products;

import Navbar from "./components/Navbar";
import Hero from "./components/sections/Hero";
import WhyAarambh from "./components/sections/WhyAarambh";
import Products from "./components/sections/Products";
import OurStory from "./components/sections/OurStory";
import HowWeMake from "./components/sections/HowWeMake";
import Gallery from "./components/sections/Gallery";
import CustomerReviews from "./components/sections/CustomerReviews";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import OwnerGallery from "./components/OwnerGallery";
function App() {

  if (window.location.pathname === "/owner-gallery") {
    return <OwnerGallery />;
  }
  return (
    <>
      <Navbar />
      <Hero />
      <WhyAarambh />
       <Products />
       <OurStory />
       <HowWeMake />
       <Gallery />
       <CustomerReviews />
        <Contact />

        <a
  href="https://wa.me/9766106849"
  target="_blank"
  rel="noreferrer"
  className="floating-whatsapp"
>
  💬
</a>
      <Footer />
       </>
  );
}


export default App;


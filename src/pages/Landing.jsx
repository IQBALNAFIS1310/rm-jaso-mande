import Hero from "../components/Hero";
import About from "../components/About";
import MenuList from "../components/MenuList";
import Contact from "../components/Contact";
import Reviews from "../components/Reviews";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <div id="home">
      <Hero />
      <About />
      <MenuList />
      <Reviews />
      <Contact /> 
      <Footer />
    </div>
  );
}

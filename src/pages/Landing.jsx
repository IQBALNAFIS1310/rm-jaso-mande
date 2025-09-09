import Hero from "../components/Hero";
import About from "../components/About";
import MenuList from "../components/MenuList";
import Contact from "../components/Contact";
import Reviews from "../components/Reviews";

export default function Landing() {
  return (
    <div>
      <Hero />
      <About />
      <MenuList />
      <Reviews />
      <Contact /> 
      {/* <Footer /> */}
    </div>
  );
}

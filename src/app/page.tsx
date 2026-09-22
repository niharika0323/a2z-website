import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Product from "./components/Product";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <main style={{ scrollBehavior: 'smooth' }}>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Product />
      <Contact />
    </main>
  );
}

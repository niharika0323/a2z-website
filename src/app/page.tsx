import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Portfolio from "./components/Portfolio";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";

export default function Home() {
  return (
    <main style={{ scrollBehavior: 'smooth' }}>
      <Navbar />
      <Hero />
      <Portfolio />
      <Services />
      <About />
      <Contact />
    </main>
  );
}

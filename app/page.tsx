import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";

export default function Home() {
  return (
    <>
      {/* Visual effects */}
      <div className="scanline" />
      <div className="noise-overlay" />
      <Cursor />

      {/* Site structure */}
      <Nav />
      <main>
        <Hero />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <Skills />
        <div className="section-divider" />
        <Projects />
        <div className="section-divider" />
        <Services />
        <div className="section-divider" />
        <Testimonials />
        <div className="section-divider" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

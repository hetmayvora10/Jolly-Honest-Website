import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Heritage from "@/components/Heritage";
import Services from "@/components/Services";
import Craftsmanship from "@/components/Craftsmanship";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <Heritage />
        <Services />
        <Craftsmanship />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

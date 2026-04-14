import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Avantages from "@/components/Avantages";
import Programme from "@/components/Programme";
import Process from "@/components/Process";
import Team from "@/components/Team";
import Rejoindre from "@/components/Rejoindre";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Avantages />
        <Programme />
        <Process />
        <Team />
        <Rejoindre />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}

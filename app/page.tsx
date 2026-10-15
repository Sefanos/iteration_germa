import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Chapter from "@/components/maquette/Chapter";
import Realisations from "@/components/Realisations";
import Tagline from "@/components/Tagline";
import SavoirFaire from "@/components/SavoirFaire";
import Showroom from "@/components/Showroom";
import Contact from "@/components/Contact";
import PageMotion from "@/components/PageMotion";
import Grain from "@/components/Grain";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Chapter />
        <Realisations />
        <Tagline />
        <SavoirFaire />
        <Showroom />
      </main>
      <Contact />
      <PageMotion />
      <Grain />
    </>
  );
}

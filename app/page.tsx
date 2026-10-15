import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Realisations from "@/components/Realisations";
import SavoirFaire from "@/components/SavoirFaire";
import Showroom from "@/components/Showroom";
import Contact from "@/components/Contact";
import PageMotion from "@/components/PageMotion";

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Realisations />
        <SavoirFaire />
        <Showroom />
      </main>
      <Contact />
      <PageMotion />
    </>
  );
}

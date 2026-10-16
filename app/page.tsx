import GardenHero from "@/components/garden/GardenHero";
import ScrollDrive from "@/components/garden/ScrollDrive";
import SectionDim from "@/components/garden/SectionDim";
import CanvasMount from "@/components/garden/CanvasMount";
import Planches from "@/components/v2/Planches";
import Index from "@/components/v2/Index";
import PlanJardin from "@/components/v2/PlanJardin";
import ShowroomV2 from "@/components/v2/ShowroomV2";
import ContactV2 from "@/components/v2/ContactV2";
import Reveal from "@/components/v2/Reveal";
import Cursor from "@/components/garden/Cursor";
import Nav from "@/components/garden/Nav";
import Loader from "@/components/garden/Loader";
import Smooth from "@/components/garden/Smooth";
import TextReveal from "@/components/garden/TextReveal";

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
      >
        Aller au contenu
      </a>
      <Loader />
      <Smooth />
      <CanvasMount />
      <SectionDim />
      <Nav />
      <GardenHero />
      <main id="main" tabIndex={-1} className="relative z-[1]">
        <Planches />
        <Index />
        <PlanJardin />
        <ShowroomV2 />
      </main>
      <ContactV2 />
      <ScrollDrive />
      <Reveal />
      <Cursor />
      <TextReveal />
    </>
  );
}

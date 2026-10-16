import HeroFilm from "@/components/v2/HeroFilm";
import Planches from "@/components/v2/Planches";
import Index from "@/components/v2/Index";
import PlanJardin from "@/components/v2/PlanJardin";
import ShowroomV2 from "@/components/v2/ShowroomV2";
import ContactV2 from "@/components/v2/ContactV2";
import Reveal from "@/components/v2/Reveal";

export default function Page() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-canvas"
      >
        Aller au contenu
      </a>
      <HeroFilm />
      <main id="main" tabIndex={-1}>
        <Planches />
        <Index />
        <PlanJardin />
        <ShowroomV2 />
      </main>
      <ContactV2 />
      <Reveal />
    </>
  );
}

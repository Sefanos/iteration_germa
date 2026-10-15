import { NNBSP } from "@/lib/content";

/** The one big typographic moment: the tagline crosses the screen, scrubbed by scroll. */
export default function Tagline() {
  return (
    <section className="tagline-band overflow-hidden py-[10vh] lg:py-[14vh]" aria-label="La nature prend forme">
      <p className="tagline-track font-display leading-none whitespace-nowrap text-forest">
        <span className="tagline-text">La nature prend forme.</span>
        <span className="tagline-text mx-[0.35em] text-terracotta" aria-hidden="true">
          ·
        </span>
        <span className="tagline-text italic" aria-hidden="true">
          Des extérieurs qui prennent vie{NNBSP}
        </span>
      </p>
    </section>
  );
}

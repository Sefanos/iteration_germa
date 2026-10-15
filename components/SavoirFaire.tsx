import Image from "next/image";
import { families, NNBSP } from "@/lib/content";

export default function SavoirFaire() {
  const [conception, ...rest] = families;

  return (
    <section id="savoir-faire" className="scroll-mt-10 border-t border-forest/10 bg-limestone">
      <div className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-3">
            <p className="eyebrow text-forest">02 — Savoir-faire</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[clamp(2.25rem,5vw,4.25rem)] leading-[1.04] text-forest">
              Concevoir, construire, entretenir{NNBSP}: six métiers, une seule équipe.
            </h2>
          </div>
        </div>

        {/* 01 Conception: the working section drawing, blended into the limestone page. */}
        <article className="mt-20 lg:mt-28" data-reveal>
          <div className="relative aspect-[3619/1384] w-full overflow-hidden">
            <Image
              src={conception.photo.src}
              alt={conception.photo.alt}
              width={conception.photo.width}
              height={conception.photo.height}
              sizes="100vw"
              className="h-full w-full object-cover mix-blend-multiply"
            />
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
            <p className="font-display text-xl text-terracotta lg:col-span-1">{conception.number}</p>
            <h3 className="font-display text-[2rem] leading-tight text-forest sm:text-[2.5rem] lg:col-span-4">
              {conception.title}
            </h3>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-base leading-relaxed text-charcoal/80">{conception.sentence}</p>
              <a href={conception.url} className="link-line mt-5 text-forest">
                {conception.linkLabel}
              </a>
            </div>
          </div>
        </article>

        <div className="mt-24 space-y-24 lg:mt-36 lg:space-y-36">
          {rest.map((f, i) => {
            const flip = i % 2 === 1;
            return (
              <article
                key={f.id}
                className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-x-8"
                data-reveal
              >
                <div
                  className={`frame parallax-media aspect-[3/2] w-full ${
                    flip ? "lg:col-start-7 lg:col-span-6" : "lg:col-start-1 lg:col-span-6"
                  }`}
                  data-parallax={6}
                >
                  <Image
                    src={f.photo.src}
                    alt={f.photo.alt}
                    width={f.photo.width}
                    height={f.photo.height}
                    sizes="(min-width:1024px) 48vw, 100vw"
                  />
                </div>
                <div
                  className={`${flip ? "lg:col-start-1 lg:col-span-5 lg:row-start-1" : "lg:col-start-8 lg:col-span-5"} lg:pb-6`}
                >
                  <p className="font-display text-xl text-terracotta">{f.number}</p>
                  <h3 className="mt-3 font-display text-[2rem] leading-tight text-forest sm:text-[2.5rem]">{f.title}</h3>
                  <p className="mt-5 max-w-[30rem] text-base leading-relaxed text-charcoal/80">{f.sentence}</p>
                  <a href={f.url} className="link-line mt-6 text-forest">
                    {f.linkLabel}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

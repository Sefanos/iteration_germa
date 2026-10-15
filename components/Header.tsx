import Image from "next/image";
import { legacy } from "@/lib/content";

const nav = [
  { href: "#maquette", label: "Notre approche" },
  { href: "#realisations", label: "Réalisations" },
  { href: "#savoir-faire", label: "Savoir-faire" },
  { href: "#showroom", label: "Showroom" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="relative z-20 h-[4.5rem] bg-forest text-limestone">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-limestone focus:px-4 focus:py-2 focus:text-forest"
      >
        Aller au contenu
      </a>
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <a href={legacy.home} className="flex shrink-0 items-center" aria-label="Germa Paysages, accueil">
          <Image
            src="/media/germa-logo.svg"
            alt="Germa Paysages"
            width={416}
            height={181}
            priority
            unoptimized
            className="h-10 w-auto sm:h-11"
          />
        </a>
        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[0.8125rem] font-medium tracking-[0.08em] text-limestone/85 transition-colors hover:text-limestone"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="hidden rounded-full border border-limestone/35 px-5 py-2.5 text-[0.8125rem] font-semibold tracking-[0.04em] transition-colors hover:border-limestone hover:bg-limestone hover:text-forest sm:inline-flex"
        >
          Parler de mon projet
        </a>
      </div>
    </header>
  );
}

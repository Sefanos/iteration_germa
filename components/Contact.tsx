import { contact, legacy, formatPhone, telHref } from "@/lib/content";

const socials = [
  { label: "Facebook", href: contact.social.facebook },
  { label: "Instagram", href: contact.social.instagram },
  { label: "LinkedIn", href: contact.social.linkedin },
];

const mainPhone = contact.locations[0].phone;

export default function Contact() {
  return (
    <footer id="contact" className="scroll-mt-10 bg-limestone">
      <div className="mx-auto max-w-[1440px] px-5 pt-24 pb-10 sm:px-8 lg:px-12 lg:pt-40 lg:pb-12">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-3">
            <p className="eyebrow text-forest">04 — Contact</p>
          </div>
          <div className="lg:col-span-8">
            <h2 className="font-display text-[clamp(2.6rem,6.5vw,5.5rem)] leading-[1.02] text-forest">
              Votre prochain projet commence ici.
            </h2>
            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-5">
              <a href={legacy.devis} className="btn-primary">
                Demander un devis
              </a>
              <a href={telHref(mainPhone)} className="link-line text-forest">
                {formatPhone(mainPhone)}
              </a>
              <a href={`mailto:${contact.email}`} className="link-line text-forest">
                {contact.email}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-x-8 gap-y-10 border-t border-forest/15 pt-12 sm:grid-cols-2 lg:mt-28 lg:grid-cols-12" data-reveal>
          {contact.locations.map((loc) => (
            <address key={loc.id} className="not-italic lg:col-span-3">
              <h3 className="font-display text-2xl text-forest">{loc.name}</h3>
              <p className="mt-1 text-[0.75rem] tracking-[0.08em] text-charcoal/60 uppercase">{loc.role}</p>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-charcoal/80">
                {loc.street}
                <br />
                {loc.postalCode} {loc.locality}
              </p>
              <a href={telHref(loc.phone)} className="link-line mt-3 text-forest">
                {formatPhone(loc.phone)}
              </a>
            </address>
          ))}
          <div className="lg:col-span-3">
            <h3 className="font-display text-2xl text-forest">Suivez-nous</h3>
            <ul className="mt-4 space-y-2.5">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="link-line text-forest">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-forest/15 pt-6 text-[0.75rem] tracking-[0.04em] text-charcoal/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {contact.legalName}. Paysagistes depuis {contact.founded}.
          </p>
          <p>Valais · Vaud · Genève · Fribourg · Neuchâtel</p>
        </div>
      </div>
    </footer>
  );
}

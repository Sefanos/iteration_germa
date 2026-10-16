import site from "@/content/site.json";

/** Narrow no-break space, used before ; : ! ? and inside « » in French typography. */
export const NNBSP = " ";

export const legacy = {
  home: "https://www.germa-paysages.ch/fr",
  showroom: "https://www.germa-paysages.ch/fr/showroom",
  devis: "https://www.germa-paysages.ch/fr/devis",
  contact: "https://www.germa-paysages.ch/fr/contact",
  realisations: "https://www.germa-paysages.ch/fr/nos-realisations",
};

export type Photo = { src: string; width: number; height: number; alt: string };

export type Project = {
  slug: string;
  title: string;
  place: string;
  family: string;
  url: string;
  photo: Photo;
};

/** The six `featured: true` projects from content/projects, with Germa's own photos. */
export const projects: Project[] = [
  {
    slug: "architecture-paysagere-et-amenagement-du-jardin-dun-chalet-de-maitre-chermignon",
    title: "Jardin d’un chalet de maître",
    place: "Chermignon",
    family: "Conception et aménagement",
    url: "https://www.germa-paysages.ch/fr/architecture-paysagere-et-amenagement-du-jardin-dun-chalet-de-maitre-chermignon",
    photo: {
      src: "/media/projects/chermignon-stairs.jpg",
      width: 1920,
      height: 1440,
      alt: "Escalier en pierre naturelle le long d’un chalet à Chermignon, mélèze pleureur et bornes lumineuses",
    },
  },
  {
    slug: "creation-dun-jardin-japonais-chablais",
    title: "Création d’un jardin japonais",
    place: "Chablais",
    family: "Massif minéral",
    url: "https://www.germa-paysages.ch/fr/creation-dun-jardin-japonais-chablais",
    photo: {
      src: "/media/projects/chablais-zen.jpg",
      width: 3978,
      height: 2160,
      alt: "Gravier ratissé en cercles autour de pierres dressées, jardin zen dans le Chablais",
    },
  },
  {
    slug: "paysagiste-villars-sur-ollon-amenagement-jardin-spa-enrochement",
    title: "Jardin, spa et enrochement",
    place: "Villars-sur-Ollon",
    family: "Spa et pierre",
    url: "https://www.germa-paysages.ch/fr/paysagiste-villars-sur-ollon-amenagement-jardin-spa-enrochement",
    photo: {
      src: "/media/projects/villars-chalet.jpg",
      width: 3978,
      height: 2160,
      alt: "Chalet à Villars-sur-Ollon avec enrochement et massif fraîchement planté",
    },
  },
  {
    slug: "un-chantier-sans-acces",
    title: "Un chantier sans accès",
    place: "Terrasse et soutènement en mélèze",
    family: "Terrasse et bois",
    url: "https://www.germa-paysages.ch/fr/un-chantier-sans-acces",
    photo: {
      src: "/media/projects/sans-acces-terrasse.jpg",
      width: 3978,
      height: 2160,
      alt: "Escalier en madriers de mélèze descendant vers une terrasse en bois",
    },
  },
  {
    slug: "mur-en-pierre-de-st-leonard-et-terrasse-en-pierre-naturelle",
    title: "Mur en pierre de St‑Léonard",
    place: "Mur et terrasse en pierre naturelle",
    family: "Murs et pierre",
    url: "https://www.germa-paysages.ch/fr/mur-en-pierre-de-st-leonard-et-terrasse-en-pierre-naturelle",
    photo: {
      src: "/media/projects/st-leonard-wall.jpg",
      width: 3978,
      height: 2160,
      alt: "Mur courbe en pierre de St-Léonard surmonté d’une barrière en bois",
    },
  },
  {
    slug: "projet-dachitecture-paysagere-realisation-dune-entree-de-maison-saint-maurice",
    title: "Entrée de maison",
    place: "Saint-Maurice",
    family: "Conception",
    url: "https://www.germa-paysages.ch/fr/projet-dachitecture-paysagere-realisation-dune-entree-de-maison-saint-maurice",
    photo: {
      src: "/media/projects/saint-maurice-entree.jpg",
      width: 3978,
      height: 2160,
      alt: "Bloc de pierre, stèles d’ardoise et graminées devant une façade rouge à Saint-Maurice",
    },
  },
];

export type Family = {
  id: string;
  number: string;
  title: string;
  sentence: string;
  url: string;
  linkLabel: string;
  photo: Photo;
};

/** The six service families from content/services.json; sentences paraphrase the service pages. */
export const families: Family[] = [
  {
    id: "conception",
    number: "01",
    title: "Conception",
    sentence:
      "Nos architectes paysagistes étudient votre jardin et l’illustrent par des plans à la main, sur informatique ou en 3D ; si nous réalisons les travaux, une partie de la conception est déduite de votre facture.",
    url: "https://www.germa-paysages.ch/fr/prestations/conceptions-par-un-architecte-paysagiste",
    linkLabel: "Conceptions par un architecte paysagiste",
    photo: {
      src: "/media/services/conception-coupe.jpg",
      width: 3619,
      height: 1384,
      alt: "Coupe de travail du jardin de Chermignon : terrasses, escaliers et plantations en pente vers le chalet",
    },
  },
  {
    id: "amenagement-plantation",
    number: "02",
    title: "Aménagement et plantation",
    sentence:
      "Terrassement, engazonnement, massifs minéraux, arrosage automatique, clôtures et végétaux de toute l’Europe, plantés avec garantie de reprise.",
    url: "https://www.germa-paysages.ch/fr/prestations/plantation-et-fournitures-de-vegetaux",
    linkLabel: "Plantation et fournitures de végétaux",
    photo: {
      src: "/media/services/amenagement-rocaille.jpg",
      width: 1920,
      height: 1440,
      alt: "Rocaille de sedum et blocs de pierre sous un chalet, Chermignon",
    },
  },
  {
    id: "terrasses-pergolas",
    number: "03",
    title: "Terrasses et pergolas",
    sentence:
      "Terrasses en bois naturel ou en WPC, dallages, pavages, escaliers et pergolas bioclimatiques, posés par nos spécialistes pour une durée de vie maximale.",
    url: "https://www.germa-paysages.ch/fr/prestations/terrasses-en-bois-naturel-ou-en-wpc",
    linkLabel: "Terrasses en bois naturel ou en WPC",
    photo: {
      src: "/media/services/terrasse-meleze.jpg",
      width: 840,
      height: 458,
      alt: "Terrasse en mélèze neuve devant un chalet, vue sur la vallée",
    },
  },
  {
    id: "murs-enrochements-pierre",
    number: "04",
    title: "Murs, enrochements et pierre",
    sentence:
      "Murs de soutènement, enrochements en pierre du Jura ou du Chablais, gabions, pierre naturelle au sol et en façade : nous trions la pierre directement en carrière.",
    url: "https://www.germa-paysages.ch/fr/prestations/enrochement-dagrement-et-de-soutenement",
    linkLabel: "Enrochement d’agrément et de soutènement",
    photo: {
      src: "/media/services/murs-enrochement.jpg",
      width: 1920,
      height: 1440,
      alt: "Enrochement et palissade en mélèze devant un chalet, avec les Alpes valaisannes en arrière-plan",
    },
  },
  {
    id: "piscines-spas-bassins",
    number: "05",
    title: "Piscines, spas et bassins",
    sentence:
      "Piscines Magiline sur mesure, spas fournis et posés, biotopes, fontaines et pièces d’eau de toutes tailles.",
    url: "https://www.germa-paysages.ch/fr/prestations/piscines",
    linkLabel: "Piscines",
    photo: {
      src: "/media/services/spa-villars.jpg",
      width: 840,
      height: 458,
      alt: "Spa posé sur une terrasse en mélèze devant un chalet à Villars-sur-Ollon",
    },
  },
  {
    id: "entretien",
    number: "06",
    title: "Entretien",
    sentence:
      "Taille, élagage, soins au gazon et contrats d’entretien annuels, avec des machines à batterie pour un entretien sans bruit ni CO₂.",
    url: "https://www.germa-paysages.ch/fr/prestations/entretien-du-jardin-sans-bruit-ni-co2",
    linkLabel: "Entretien du jardin sans bruit ni CO₂",
    photo: {
      src: "/media/services/entretien-gazon.jpg",
      width: 1600,
      height: 1200,
      alt: "Gazon tondu en bandes et terrasse en dalles de pierre le long d’un chalet, Chermignon",
    },
  },
];

export const showroom = {
  hours: site.showroom.hours,
  byAppointmentPhone: site.showroom.phone,
  audience: site.showroom.audience,
  locationDescription: site.showroom.locationDescription,
  url: site.showroom.legacyUrl,
};

export const contact = {
  email: site.contact.email,
  locations: site.locations,
  social: site.social,
  legalName: site.legalName,
  founded: site.founded,
};

export function telHref(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

export function formatPhone(phone: string) {
  // "+41 24 471 25 78" -> "024 471 25 78"
  const m = phone.match(/^\+41\s*(\d{2})\s*(\d{3})\s*(\d{2})\s*(\d{2})$/);
  return m ? `0${m[1]} ${m[2]} ${m[3]} ${m[4]}` : phone;
}

const DAY_LABEL: Record<string, string> = {
  lundi: "Lundi",
  mardi: "Mardi",
  mercredi: "Mercredi",
  jeudi: "Jeudi",
  vendredi: "Vendredi",
  samedi: "Samedi",
  dimanche: "Dimanche",
};

export function formatDays(days: string[]) {
  const labels = days.map((d) => DAY_LABEL[d] ?? d);
  if (labels.length === 1) return labels[0];
  return `${labels.slice(0, -1).join(", ")} et ${labels[labels.length - 1].toLowerCase()}`;
}

export function formatHour(h: string) {
  // "13:30" -> "13h30", "10:00" -> "10h"
  const [hh, mm] = h.split(":");
  return mm === "00" ? `${hh}h` : `${hh}h${mm}`;
}

/** Hand-drawn landscape-plan symbols, one per family. Hairline ink, drawn by dash offset when their row enters. */
export const SYMBOLS: Record<string, React.ReactNode> = {
  // 01 conception: a plan with a north arrow
  conception: (
    <>
      <rect x="10" y="12" width="60" height="44" />
      <path d="M22 44 C 34 20, 48 50, 60 26" />
      <path d="M70 8 l0 -0 M66 18 l4 -10 4 10 M70 8 v12" />
    </>
  ),
  // 02 aménagement et plantation: tree canopies
  "amenagement-plantation": (
    <>
      <circle cx="30" cy="36" r="18" className="canopy" />
      <circle cx="56" cy="24" r="11" className="canopy" />
      <path d="M30 18 v36 M12 36 h36" />
      <circle cx="30" cy="36" r="2" />
    </>
  ),
  // 03 terrasses et pergolas: decking hatch and a pergola grid
  "terrasses-pergolas": (
    <>
      <rect x="8" y="14" width="64" height="40" />
      <path d="M8 24 h64 M8 34 h64 M8 44 h64" />
      <path d="M20 14 v40 M40 14 v40 M60 14 v40" className="faint" />
    </>
  ),
  // 04 murs: dry-stone wall hatch
  "murs-enrochements-pierre": (
    <>
      <path d="M8 46 l10 -8 14 4 12 -10 14 6 14 -8" />
      <path d="M8 54 h64" />
      <path d="M14 30 l8 -4 M30 26 l8 2 M46 22 l8 -2 M60 24 l6 2" className="faint" />
    </>
  ),
  // 05 piscines, spas: water ripples
  "piscines-spas-bassins": (
    <>
      <rect x="10" y="16" width="60" height="36" rx="2" />
      <path d="M16 30 q6 -4 12 0 t12 0 t12 0 t12 0" className="ripple" />
      <path d="M16 40 q6 -4 12 0 t12 0 t12 0 t12 0" className="ripple r2" />
    </>
  ),
  // 06 entretien: mower stripes and a clipped hedge
  entretien: (
    <>
      <path d="M8 56 L72 56" />
      <path d="M12 56 l12 -36 M24 56 l12 -36 M36 56 l12 -36 M48 56 l12 -36" className="faint" />
      <path d="M14 20 h52" />
      <path d="M20 14 q20 -10 40 0" />
    </>
  ),
};

export default function PlanSymbol({ id }: { id: string }) {
  return (
    <svg className="plan-symbol" viewBox="0 0 80 64" aria-hidden="true" focusable="false">
      {SYMBOLS[id]}
    </svg>
  );
}

# Asset manifest

| Asset | Source | Licence / rights | Purpose | Optimisation | Replacement |
|---|---|---|---|---|---|
| `public/media/hero-chermignon-path.jpg` | Germa photo `9_1.jpg`, upscaled with Higgsfield (U1, bytedance 4k) | Germa's own photo; rights to confirm with Germa | Hero still (LCP) | 2880×2160 JPEG q4, next/image AVIF/WebP | Original from Germa when supplied |
| `public/media/hero-loop.{mp4,webm}` | Higgsfield H1 take 1 (Kling 3.0) from the same photo | Derived from Germa's photo | Hero loop, fades in over the still | 1280×960, H.264 crf 25 / VP9 crf 34, muted | Drone or video footage from Germa |
| `public/media/projects/*.jpg`, `public/media/services/*.jpg` | Germa photos from `content/media/` | Germa's own photos | Réalisations, Savoir-faire | Served through next/image | Hi-res originals from Germa |
| `public/media/materials/{pierre-valais,meleze}.jpg` | Higgsfield M1/M2 (GPT Image 2.5) | Generated illustrations, not Germa projects | Showroom material plates | 2048×1360 JPEG | Photos of the real showroom samples |
| `public/media/maquette-poster.jpg` | Rendered from the procedural scene (`?maquette=poster`) | Ours | Poster for reduced motion / no WebGL / saveData, and before the scene mounts | 1920×1080 JPEG | Re-render after any scene change (`node tools/poster.mjs`) |
| `content/reference/maquette/R*.png` | Higgsfield R1–R4 | Generated references | Art direction only | — | Never shipped |
| Chapter 02 geometry | Procedural (three.js primitives, `components/maquette/Scene.tsx`) | Ours | « La nature prend forme » | ~0 KB of assets; three.js loaded lazily | GLB of a real Germa project, see below |

## Replacing the procedural garden with a real project (GLB)

The timeline drives a plain state object (`components/maquette/state.ts`); a GLB can replace
`Garden` in `Scene.tsx` without touching the timeline if it follows these conventions:

- **Units:** metres. **Up:** +Y. **Origin:** centre of the plot at table level (y = 0). The plot is about 11 m × 8 m; the slope rises toward −Z.
- **Node names** (read with `useGLTF`, matched by prefix):
  - `Terrain_L0` … `Terrain_L3` — contour terraces, bottom to top (always visible, receive shadows).
  - `Wall_*`, `Terrace_*`, `Steps_*`, `Pergola_*`, `Path_*` — volumes that rise during *Concevoir*; each gets `scale.y` from 0 → 1 with its pivot at the base, in that order.
  - `Tree_*` — rise during *Réaliser* (uniform scale from 0, pivot at the base).
  - `Grass_*` — instanced or merged clusters; rise during *Réaliser*, sway during *Faire vivre*.
  - `Plan_*` — optional line objects drawn during *Imaginer*.
- **Materials:** each mesh may carry `userData.plaster` (hex) and `userData.final` (hex); the scene lerps between them with `sceneState.material`. Without them, the mesh keeps its own material.
- **Size:** compress with `gltf-transform optimize --compress meshopt`, target ≤ 1.5 MB gzip.

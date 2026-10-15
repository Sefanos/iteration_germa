# Implementation notes

## Chapter 02 « La nature prend forme » — pre-rendered route (decided 2026-10-15)

The procedural three.js maquette was built first (React Three Fiber, one GSAP timeline driving a
state object, four phases). Rendered against the R1–R4 references it read as a low-poly diagram:
flat plaster boxes, cone grasses and a crude camera, nowhere near the craft of a real study model,
and the user asked to switch to generated video.

Current approach:

1. Four consistent states of **one** model were derived from reference R3 with GPT Image 2.5 edits
   (ink plan on the plaster slab → white volumes → materials → colour and warm light).
2. Kling 3.0 animated the transitions with start and end frames (3 clips) plus a "living" loop (1 clip).
3. The clips are concatenated and exported as a WebP frame sequence (`public/media/maquette/seq/{1600,800}/`),
   scrubbed on native scroll in the pinned chapter and drawn on a canvas. The four words stay real DOM text.
4. Reduced motion, `saveData` or no frames → the poster (last frame) and the four words as a static list.

Why frames rather than `<video currentTime>`: seeking a compressed video on scroll stutters at group-of-pictures
boundaries; a frame sequence scrubs deterministically and needs no decoder work per scroll event.

Cost: ~5–7 MB of WebP at 1600 px for ~160 frames, loaded only when the chapter is within one viewport.

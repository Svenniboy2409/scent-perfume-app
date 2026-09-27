// Procedural wood grain for the Shelfie cabinet, as SVG data URIs used as CSS
// background layers. Stretched fractal noise (fine across the grain, long
// along it) reads as wood grain; a second, coarser pass adds the broad
// light/dark bands of the figure. Each texture is only grain — dark and light
// streaks with transparency — so it is laid over a CSS colour gradient.

function grain({ width, height, along, across, seed, dark, light, vertical = false }) {
  // Noise frequencies: low along the grain, high across it.
  const fx = vertical ? across : along
  const fy = vertical ? along : across
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">` +
    `<filter id="g" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">` +
    // Fine grain lines.
    `<feTurbulence type="fractalNoise" baseFrequency="${fx} ${fy}" numOctaves="4" seed="${seed}" stitchTiles="stitch" result="n"/>` +
    // Broad figure bands.
    `<feTurbulence type="fractalNoise" baseFrequency="${fx / 3} ${fy / 6}" numOctaves="2" seed="${seed + 11}" stitchTiles="stitch" result="b"/>` +
    `<feComposite in="n" in2="b" operator="arithmetic" k2="0.65" k3="0.5" k4="-0.08" result="m"/>` +
    // Dark streaks: alpha rises where the noise is low.
    `<feColorMatrix in="m" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.06  0 0 0 0 0.02  ${-dark * 4} 0 0 0 ${dark * 2.1}" result="d"/>` +
    // Light streaks: alpha rises where the noise is high.
    `<feColorMatrix in="m" type="matrix" values="0 0 0 0 1  0 0 0 0 0.86  0 0 0 0 0.66  ${light * 4} 0 0 0 ${-light * 2.3}" result="l"/>` +
    `<feMerge><feMergeNode in="d"/><feMergeNode in="l"/></feMerge>` +
    `</filter>` +
    `<rect width="100%" height="100%" filter="url(#g)"/>` +
    `</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

// Horizontal boards: the plank's front edge and top face, the frame's rails.
export const WOOD_PLANK = grain({ width: 640, height: 80, along: 0.0035, across: 0.16, seed: 4, dark: 0.55, light: 0.35 })
// The back wall's vertical boards.
export const WOOD_PANEL = grain({ width: 240, height: 640, along: 0.004, across: 0.09, seed: 9, dark: 0.5, light: 0.22, vertical: true })
// The frame's stiles (vertical grain, a little tighter).
export const WOOD_FRAME = grain({ width: 120, height: 640, along: 0.005, across: 0.14, seed: 21, dark: 0.55, light: 0.3, vertical: true })

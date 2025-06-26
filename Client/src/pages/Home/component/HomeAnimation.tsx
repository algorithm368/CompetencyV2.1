/**
 * Animation configuration object for scaling in an element.
 *
 * @property initial - The initial state of the animation, with reduced opacity and scale.
 * @property animate - The final state of the animation, with full opacity and scale.
 * @property transition - The transition settings, including duration and easing curve.
 *
 * This object can be used with animation libraries such as Framer Motion to animate
 * components with a scale-in effect.
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: {
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94],
  },
};
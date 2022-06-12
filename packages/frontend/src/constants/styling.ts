const shrinkTransforms = {
  shrink: 'scale(0.95)',
  shrinkSm: 'scale(0.9)',
  shrinkTransition: '0.125s ease',
};

const growTransforms = {
  grow: 'scale(1.025)',
  growLg: 'scale(1.1)',
  growTransition: '0.125s ease',
};

export const TRANSFORMS = {
  ...growTransforms,
  ...shrinkTransforms,
};

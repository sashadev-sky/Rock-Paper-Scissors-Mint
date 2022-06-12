export const truthyOrZero = (value: number | undefined) => (
  !!(value || value === 0)
);

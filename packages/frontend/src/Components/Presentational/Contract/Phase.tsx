import { Breakpoint, Theme, Typography, useMediaQuery } from '@mui/material';

import { PHASE } from '../../../constants';

interface Props {
  isSoldOut: boolean;
  paused: boolean;
  phase: number;
}

const getText = (phase: number, isSoldOut: boolean, paused: boolean) => {
  if (paused) { return 'Paused'; }
  if (isSoldOut) { return 'Sold Out'; }
  if (phase === PHASE.PHASE_WHITELIST) { return 'Whitelist Sale'; }
  if (phase === PHASE.PHASE_PUBLIC) { return 'Public Sale'; }
  if (phase === PHASE.PHASE_CLOSED) { return 'Closed'; }
  return '';
};

const Phase = ({ phase, isSoldOut, paused }: Props) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('mobile' as Breakpoint));
  const isTinyMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xsmobile' as Breakpoint));
  const isMobileBreakpoint = isMobile || isTinyMobile;
  const phaseText = getText(phase, isSoldOut, paused);

  return (
    <Typography
      color="text.secondary"
      variant="h3"
      component="h2"
      mb={isMobileBreakpoint ? 0.5 : 2.5}
    >
      {phaseText}
    </Typography>
  );
};

export default Phase;

import { Theme, Typography, useMediaQuery } from '@mui/material';

import { PHASE } from '../../../constants';

interface Props {
  isSoldOut: boolean;
  phase: number;
}

const Phase = ({ phase, isSoldOut }: Props) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('mobile'));
  const isTinyMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xsmobile'));
  const isMobileBreakpoint = isMobile || isTinyMobile;

  return (
    <Typography
      color='text.secondary'
      variant='h3'
      component='h2'
      mb={isMobileBreakpoint ? 0.5 : 2.5}
    >
      {isSoldOut && 'Sold Out'}
      {phase === PHASE.PHASE_WHITELIST && 'Whitelist Sale'}
      {phase === PHASE.PHASE_PUBLIC && 'Public Sale'}
      {phase === PHASE.PHASE_CLOSED && 'Closed'}
    </Typography>
  );
};

export default Phase;

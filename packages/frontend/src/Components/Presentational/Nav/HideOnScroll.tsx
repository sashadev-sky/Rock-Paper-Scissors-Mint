import { cloneElement } from 'react';
import { useScrollTrigger } from '@mui/material';

import { AnimatedComponentProps } from '../../../types/props';

const HideOnScroll = (props: AnimatedComponentProps) => {
  const isOnTop = !useScrollTrigger({
    disableHysteresis: true,
    threshold: 30,
  });

  return cloneElement(props.children, {
    elevation: isOnTop ? 4 : 0,
    color: isOnTop ? 'secondary' : 'neutral',
  });
};

export default HideOnScroll;

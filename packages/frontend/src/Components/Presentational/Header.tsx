import { cloneElement, useEffect } from 'react';
import { Typography } from '@mui/material';
import { animated, easings, useSpring } from 'react-spring';

import { AnimatedComponentProps } from '../../types/props';

const AnimatedTypography = (props: AnimatedComponentProps) => {
  const [styles, set] = useSpring(() => ({
    to: [
      { scale: 1, rotate: 360 },
      { scale: 1.5, rotate: 360 },
      { scale: 2, rotate: 380 },
      { scale: 1, rotate: 360 },
    ],
    from: { scale: 0, rotate: 0 },
    bounce: 1,
    delay: 1500,
    config: {
      duration: 1000,
      frequency: 1,
      easing: easings.easeInOutQuart,
    },
  }));

  useEffect(() => {
    const timeout = setTimeout(() => {
      set.start({ config: { velocity: 10 } });
      set.start({ config: { friction: 20 } });
    }, 1500);
    return () => clearTimeout(timeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return cloneElement(props.children, {
    component: animated.sup,
    style: styles,
  });
};

const Header = () => (
  <header>
    <Typography
      color='text.primary'
      variant='h1'
      component='h1'
      sx={{ filter: 'saturate(0.65)' }}
    >
      RPS
      <AnimatedTypography>
        <Typography
          component='sup'
          variant='h1sup'
          display='inline-block'
        >
          NFT
        </Typography>
      </AnimatedTypography>
    </Typography>
  </header>
);

export default Header;

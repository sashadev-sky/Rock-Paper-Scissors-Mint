import { useCallback, useEffect } from 'react';
import { Stack, useMediaQuery } from '@mui/material';
import { Theme, useTheme } from '@mui/material/styles';

import Display from './Display';
import ButtonDecrement from './ButtonDecrement';
import ButtonIncrement from './ButtonIncrement';

interface Props {
  canMintAmount: number;
  counter: number;
  setCounter: (counter: number) => void;
  shouldDisableCounter: () => boolean;
}

const BoxCounter = ({ canMintAmount, counter, setCounter, shouldDisableCounter }: Props) => {
  const { palette } = useTheme();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('mobile'));
  const isTinyMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xsmobile'));
  const isMobileBreakpoint = isMobile || isTinyMobile;

  const decrementDisabled = shouldDisableCounter() || counter === 1;
  const incrementDisabled = shouldDisableCounter() || counter === canMintAmount;

  useEffect(() => {
    if (counter > canMintAmount) {
      setCounter(Math.max(canMintAmount, 1));
    }
  }, [canMintAmount, counter, setCounter]);

  const incrementCounter = useCallback(() => {
    setCounter(Math.min(counter + 1, canMintAmount));
  }, [setCounter, counter, canMintAmount]);

  const decrementCounter = useCallback(() => {
    setCounter(Math.max(1, counter - 1));
  }, [counter, setCounter]);

  return (
    <Stack
      alignItems='center'
      direction='row'
      spacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      sx={{
        alignSelf: 'center',
        border: '1px solid',
        borderStyle: 'outset',
        color: palette.primary.main,
        px: '50px',
      }}
    >
      <ButtonDecrement
        disabled={decrementDisabled}
        onClick={decrementCounter}
        mobile={isMobileBreakpoint}
      />
      <Display color={palette.common.black} message={counter} mobile={isMobileBreakpoint} />
      <ButtonIncrement
        disabled={incrementDisabled}
        onClick={incrementCounter}
        mobile={isMobileBreakpoint}
      />
    </Stack>
  );
};

export default BoxCounter;

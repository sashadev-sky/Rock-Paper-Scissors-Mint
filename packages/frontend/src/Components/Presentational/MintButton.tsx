import { LoadingButton } from '@mui/lab';
import { Breakpoint, Stack, Theme, useMediaQuery } from '@mui/material';

import ErrorText from '../Styled/ErrorText';

interface Props {
  buttonText?: string;
  loading?: boolean;
  error?: string | undefined | null;
  onClick: () => void;
  shouldDisableMintButton?: () => boolean;
}

const MintButton = ({
  buttonText = 'Add to Cart',
  loading = false,
  error = null,
  onClick,
  shouldDisableMintButton = () => false,
}: Props) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('mobile' as Breakpoint));
  const isTinyMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xsmobile' as Breakpoint));
  const mobileBreakpoint = isMobile || isTinyMobile;
  const disabled = shouldDisableMintButton();

  return (
    <Stack>
      <LoadingButton
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        size={mobileBreakpoint ? 'small' : 'large'}
        {...(mobileBreakpoint
          ? { sx: { fontSize: '1rem' } }
          : { sx: { my: 2, fontSize: '1.7rem' } })}
        variant='contained'
      >
        {buttonText}
      </LoadingButton>
      {error && (
        <ErrorText
          align='center'
          className='trade-gothic'
          sx={{
            filter: 'saturate(0.65)',
            letterSpacing: '-0.5px',
            mt: mobileBreakpoint ? 0.4 : -1,
          }}
          variant='caption'
        >
          {error}
        </ErrorText>
      )}
    </Stack>
  );
};

export default MintButton;

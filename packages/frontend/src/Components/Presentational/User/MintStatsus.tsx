import { Container, Theme, useMediaQuery } from '@mui/material';
import SecondaryText from '../../Styled/SecondaryText';

interface Props {
  status: string;
}

const MintStatus = ({ status }: Props) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('mobile'));
  const isTinyMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xsmobile'));
  const mob = isMobile || isTinyMobile;

  return (
    <Container sx={{ pb: 2 }}>
      <SecondaryText
        className='trade-gothic'
        sx={{
          textAlign: 'center',
          fontSize: mob ? '0.65rem' : '1rem',
          mb: 2,
        }}
        variant='caption'
      >
        {status}
      </SecondaryText>
    </Container>
  );
};

export default MintStatus;

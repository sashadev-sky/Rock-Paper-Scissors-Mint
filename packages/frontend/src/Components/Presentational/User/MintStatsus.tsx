import { Theme, useMediaQuery } from '@mui/material';
import SecondaryText from "../../Styled/SecondaryText";

interface Props {
  status: string;
}

const MintStatus = ({ status }: Props) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('mobile'));
  const isTinyMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xsmobile'));
  const mob = isMobile || isTinyMobile;

  return (
    <SecondaryText
      className='trade-gothic'
      sx={{
        textAlign: 'center',
        fontSize: mob ? '0.65rem' : '1rem',
      }}
      variant='caption'
    >
      {status}
    </SecondaryText>
  );
};

export default MintStatus;
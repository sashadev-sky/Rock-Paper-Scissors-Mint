import { Typography, useMediaQuery, useTheme } from '@mui/material';

import { getShortWalletAddress } from '../../../utils/wallet';
import WalletIcon from '../../Icons/WalletIcon';

interface Props {
  walletAddress: string;
}

const Address = ({ walletAddress }: Props) => {
  const theme = useTheme();
  const isTinyMobile = useMediaQuery(theme.breakpoints.only('xsmobile'));
  return (
    <Typography className='fat-frank' color='primary' sx={{ fontSize: '1.17rem' }}>
      <WalletIcon />
      {!isTinyMobile && ' ' + getShortWalletAddress(walletAddress)}
    </Typography>
  );
};

export default Address;

import { Grid, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

import { CHAIN_ID, CHAIN_IDS, INSTAGRAM_HANDLE } from '../../constants';
import EtherScanIcon from '../Icons/EtherScanIcon';
import InstagramIcon from '../Icons/InstagramIcon';

interface Props {
  chainId: number | undefined;
}

const Footer = ({ chainId = CHAIN_ID }: Props) => (
  <footer>
    <Grid
      container
      alignItems='center'
      fontSize={48}
      justifyContent='center'
      bgcolor='background.default'
      px={4}
      position='relative'
      zIndex={1}
      spacing={4}
    >
      <Grid item ml={-2}>
        <Link
          target='_blank'
          href={`https://www.instagram.com/${INSTAGRAM_HANDLE}/`}
          rel='noopener noreferrer'
        >
          <InstagramIcon />
        </Link>
      </Grid>
      <Grid item ml={-1}>
        <Link
          target='_blank'
          href={`${CHAIN_IDS[chainId]?.etherScanUrl}/address/${CHAIN_IDS[chainId]?.proxyContractAddress}`}
          rel='noopener noreferrer'
        >
          <EtherScanIcon />
        </Link>
      </Grid>
      <Grid container justifyContent='center' mb={4}>
        <Grid item mx={2}>
          <RouterLink to='/'>
            <Typography color='text.primary' variant='h6' component='h6'>
              Home
            </Typography>
          </RouterLink>
        </Grid>
        <Grid item>
          <RouterLink to='/about'>
            <Typography color='text.primary' variant='h6' component='h6'>
              About
            </Typography>
          </RouterLink>
        </Grid>
      </Grid>
    </Grid>
  </footer>
);

export default Footer;

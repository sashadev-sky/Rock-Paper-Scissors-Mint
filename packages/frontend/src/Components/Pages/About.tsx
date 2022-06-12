import {
  Card,
  Link,
  Stack,
  Theme,
  Typography,
  useMediaQuery,
} from '@mui/material';

import Bullet from '../Presentational/Bullet';
import Main from '../Styled/Main';

const About = () => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('mobile'));
  const isTinyMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xsmobile'));
  const isMobileBreakpoint = isMobile || isTinyMobile;

  return (
    <Main>
      <Stack mx='auto' mb={4} px={isMobileBreakpoint ? 4 : 8}>
        <Typography
          sx={{ filter: 'saturate(0.65)' }}
          color='text.primary'
          variant='h2'
          className='fat-frank'
          component='h1'
        >
          About
        </Typography>
        <Card
          sx={{
            bgcolor: 'secondary.main',
            minHeight: '65vh',
            p: isMobileBreakpoint ? 4 : 8,
          }}
        >
          <Stack sx={{ textAlign: 'left' }}>
            <Typography
              sx={{ filter: 'saturate(0.65)' }}
              color='common.white'
              variant='h3'
              className='fat-frank'
              component='h2'
            >
              FAQ
            </Typography>
            <Typography
              variant='h6'
              mt={2}
              color='text.secondary'
            >
              <Bullet>
                1.{' '}
              </Bullet>
              What is the RPS NFT?
            </Typography>
            <Typography
              mt={2}
              color='common.white'
            >
              The RPS NFT is a homegrown NFT project made just for fun.
            </Typography>
            <Typography
              variant='h6'
              mt={2}
              color='text.secondary'
            >
              <Bullet>
                2.{' '}
              </Bullet>
              How do I buy one?
            </Typography>
            <Typography
              mt={2}
              color='common.white'
            >
              You need an Ethereum wallet to buy some rETH. I recommend{' '}
              <Link href='https://metamask.io/'>Metamask</Link> (On mobile, I
              recommend Metamask's mobile app internal browser). Set your wallet
              to support the Rinkeby chain and get some rETH from a{' '}
              <Link href='https://rinkebyfaucet.com/'>Faucet</Link>. Then you
              use this website as long as there is a remaining supply and the
              sale is not closed.
            </Typography>
            <Typography
              variant='h6'
              mt={2}
              color='text.secondary'
            >
              <Bullet>
                3.{' '}
              </Bullet>
              How much ETH do I need to buy one?
            </Typography>
            <Typography
              mt={2}
              color='common.white'
            >
              The whitelist will be 0.001 rEth, (plus gas), and the public sale
              will be 0.002 rEth, (plus gas).
            </Typography>
            <Typography
              variant='h6'
              mt={2}
              color='text.secondary'
            >
              <Bullet>
                4.{' '}
              </Bullet>
              How is it made?
            </Typography>
            <Typography
              mt={2}
              color='common.white'
            >
              This batch is ERC1155 / metadata on-chain / asset on IPFS.
            </Typography>
          </Stack>
        </Card>
      </Stack>
    </Main>
  );
}

export default About;

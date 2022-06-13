import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Breakpoint,
  Button,
  Grid,
  IconButton,
  Theme,
  useMediaQuery
} from '@mui/material';
import { ConnectButton } from '@sboginsky17/rainbowkit';

import { isCorrectChainId } from '../../utils/ethereum';
import WalletIcon from '../Icons/WalletIcon';
import Address from '../Presentational/User/Address';
import HoverScaleButton from '../Styled/HoverScaleButton';

interface Props {
  buttonText?: string;
  isConnected?: boolean;
  isConnecting?: boolean;
  rounded?: boolean;
}

const Connect = ({
  buttonText = 'Connect Wallet',
  isConnected = true,
  isConnecting = false,
  rounded = false
}: Props) => {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('mobile' as Breakpoint));
  const isTinyMobile = useMediaQuery((theme: Theme) => theme.breakpoints.only('xsmobile' as Breakpoint));
  const mobileBreakpoint = isMobile || isTinyMobile;

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const unsupportedChain = chain ? chain.unsupported || !isCorrectChainId(chain.id) : false;

        return (
          <Grid
            container
            {...isTinyMobile && !rounded ? { width: '70%' } : {}}
            {...!rounded && { justifyContent: 'flex-end' }}
            {...(!mounted && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!mounted || !account || !chain || !isConnected || isConnecting) {
                return (
                  mobileBreakpoint && !rounded ? (
                    <IconButton
                      aria-label='connect wallet icon'
                      color='primary'
                      onClick={openConnectModal}
                      size='large'
                    >
                      <WalletIcon />
                    </IconButton>
                  ) : (
                    <HoverScaleButton
                      aria-label={rounded ? 'connect wallet' : 'connect wallet navbar'}
                      color='primary'
                      disableElevation={rounded}
                      disableRipple
                      focusVisibleClassName='focus-visible'
                      size={mobileBreakpoint ? 'small' : rounded ? 'medium' : 'large'}
                      onClick={openConnectModal}
                      loading={isConnecting}
                      startIcon={rounded ? undefined : <WalletIcon />}
                      {...(!isTinyMobile && rounded && { sx: { padding: '0.75rem 1.5rem' }})}
                      variant={!mobileBreakpoint && !rounded ? 'outlined' : 'contained'}
                    >
                      {buttonText}
                    </HoverScaleButton>
                  )
                );
              }

              if (unsupportedChain) {
                return (
                  <HoverScaleButton
                    color='error'
                    disableElevation={rounded}
                    disableRipple
                    focusVisibleClassName='focus-visible'
                    size={mobileBreakpoint ? 'small' : 'medium'}
                    endIcon={<ExpandMoreIcon />}
                    onClick={openChainModal}
                    variant='contained'
                  >
                    Wrong Network
                  </HoverScaleButton>
                );
              }

              return (
                <Grid
                  container
                  alignItems={isTinyMobile ? 'center' : 'flex-end'}
                  flexDirection='column'
                  {...(!isTinyMobile ? { display: 'flex', flexWrap: 'wrap' } : { alignItems: 'baseline', display: 'inline-flex' })}
                  justifyContent='center'
                >
                  <Grid
                    item
                    {...(isTinyMobile ? { display: 'inline-flex' } : {})}
                    mt={mobileBreakpoint ? 1 : 0}
                  >
                    <Button onClick={openAccountModal}>
                      <Address walletAddress={account.address} />
                    </Button>
                    {isTinyMobile && (
                      <Button
                        onClick={openChainModal}
                        sx={{ mb: 1, ml: -2.5 }}
                      >
                        <img
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          style={{ width: 12, height: 12 }}
                        />
                      </Button>
                    )}
                  </Grid>
                  {!isTinyMobile && (
                    <Grid item>
                      <Button
                        onClick={openChainModal}
                        startIcon={
                          chain.hasIcon
                            ? (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 12, height: 12 }}
                              />
                            )
                            : undefined
                        }
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                          pt: 0,
                          mt: -1,
                        }}
                      >
                        {chain.name}
                      </Button>
                    </Grid>
                  )}
                </Grid>
              );
            })()}
          </Grid>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default Connect;

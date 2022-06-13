
import { useCallback, useEffect, useState } from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  useTheme
} from '@mui/material';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { ethers } from 'ethers';
import {
  useAccount,
  useConnect,
  useContract,
  useContractEvent,
  useContractRead,
  useContractWrite,
  useNetwork,
  useProvider,
  useSigner,
} from 'wagmi';

import { PHASE, CHAIN_ID, CONTRACT_PARAMS, GAS_LIMIT } from '../../constants';
import { truthyOrZero } from '../../utils';
import { getUserMintingAllowanceMsg, isSoldOut } from "../../utils/contract";
import { isCorrectChainId } from '../../utils/ethereum';
import Connect from '../Connect/Connect';
import MintStats from '../Presentational/Contract/MintStats';
import Phase from '../Presentational/Contract/Phase';
import BoxCounter from '../Presentational/Counter/BoxCounter';
import Header from '../Presentational/Header';
import MintButton from '../Presentational/MintButton';
import Notify from '../Presentational/Notify';
import SubHeader from '../Presentational/SubHeader';
import MintStatus from '../Presentational/User/MintStatsus';
import Main from '../Styled/Main';
import StackOverImage from '../Styled/StackOverImage';

const Home = () => {
  const theme = useTheme();
  const provider = useProvider({ chainId: CHAIN_ID });
  const { data: user } = useAccount();
  const {
    activeConnector,
    isConnected,
    isConnecting,
    isReconnecting,
  } = useConnect();
  const { data: signer } = useSigner();
  const { activeChain } = useNetwork({ chainId: CHAIN_ID });
  /**
   * get the smart contract
   *
   * When interacting with the upgradeable contract you should use the ABI
   * of the implementation contract (i.e ContractName or ContractNameV2)
   * with the address of the proxy contract.
   */
  let contract = useContract({
    ...CONTRACT_PARAMS,
    signerOrProvider: signer || provider,
  });
  const chainId = activeChain?.id;
  let walletAddress = user?.address || '';

  const { data: paused } = useContractRead(CONTRACT_PARAMS, 'paused', {
    chainId: CHAIN_ID,
    enabled: !!contract,
    watch: true,
  }) as any;

  const { data: phase } = useContractRead(CONTRACT_PARAMS, 'saleState', {
    chainId: CHAIN_ID,
    enabled: !!contract,
    watch: true,
  }) as any;

  const cost = +ethers.utils.formatEther(useContractRead(CONTRACT_PARAMS, 'cost', {
    chainId: CHAIN_ID,
    enabled: !!contract,
  }).data as any || 0);

  const { data: nftsMintedUnparsed, refetch: refetchMintedCount } = useContractRead(
    CONTRACT_PARAMS,
    'supply',
    {
      chainId: CHAIN_ID,
      enabled: !!contract
    }
  );

  const nftsMinted = nftsMintedUnparsed ? +nftsMintedUnparsed : -1;

  const supplyLimit = +(useContractRead(
    CONTRACT_PARAMS,
    phase === PHASE.PHASE_WHITELIST ? 'whitelistSupplyLimit' : 'supplyLimit',
    {
      chainId: CHAIN_ID,
      enabled: !!contract && truthyOrZero(nftsMinted),
    }
  ) as any).data || 0;

  const nftsRemaining = supplyLimit ? supplyLimit - nftsMinted : -1;

  const maxAmountPerUser = +(useContractRead(
    CONTRACT_PARAMS,
    phase === PHASE.PHASE_WHITELIST ? 'maxWhitelistMintAmount' : 'maxPublicSaleMintAmount',
    {
      chainId: CHAIN_ID,
      enabled: !!(contract && phase && [PHASE.PHASE_PUBLIC, PHASE.PHASE_WHITELIST].includes(phase)),
    }
  ).data as any || 0);

  const {
    data: userMintedAmount,
    refetch: refetchUserMintedAmount,
  } = useContractRead(
    CONTRACT_PARAMS,
    phase === PHASE.PHASE_WHITELIST ? 'whitelistMintedByAddress' : 'publicMintedByAddress',
    {
      chainId: CHAIN_ID,
      enabled: !!(walletAddress && phase && [PHASE.PHASE_PUBLIC, PHASE.PHASE_WHITELIST].includes(phase) && isConnected),
      overrides: { from: walletAddress },
    }
  ) as any;

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [counter, setCounter] = useState(1); // Counter
  const [status, setStatus] = useState(''); // Status

  const [canMintAmount, setCanMintAmount] = useState(-1); // Total user can mint
  const [costOfMint, setCostOfMint] = useState<ethers.BigNumberish>(0);

  const addRecentTransaction = useAddRecentTransaction();

  /**
   * Subscrube to provider events compatible with EIP-1193 standard.
   * TODO - listen for coinbase chain changed event
   */
  useEffect(() => {
    if (!activeConnector) { return; }

    let provider: any;
    activeConnector?.getProvider?.().then((provider_) => {
      provider = provider_;
      provider.on('disconnect', () => { window.location.reload(); });
    });

    return () => {
      provider?.removeListener('disconnect', () => { window.location.reload(); });
    };
  }, [activeConnector]);

  let {
    write: mint,
    error: mintError,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    reset: resetMintState,
  } = useContractWrite(CONTRACT_PARAMS, "publicMint", {
    args: [counter],
    overrides: {
      from: walletAddress,
      value: costOfMint, // this value must match the smart contract!
      gasLimit: GAS_LIMIT, // prevents an error thrown from `estimateGas` without the provider popup opening to tell the user
    },
  });

  useContractEvent(CONTRACT_PARAMS, 'TransferBatch', async (event) => {
    const eventTouse: any = event[event.length - 1];
    const { transactionHash, getTransactionReceipt } = eventTouse;

    addRecentTransaction({
      description: 'Public Mint',
      hash: transactionHash,
    });

    const receipt = await getTransactionReceipt();
    if (receipt.status === 1) {
      setSnackbarOpen(true);
      setTimeout(() => {
        resetMintState();
        refetchMintedCount();
        refetchUserMintedAmount();
      }, 3000);
    } else {
      resetMintState();
    }
  });

  useEffect(() => {
    (mintError as any)?.reason && setSnackbarOpen(true);
  }, [mintError]);

  const closeSnackbar = useCallback(() => {
    setSnackbarOpen(false);
    resetMintState();
  }, [resetMintState]);

  // TODO dont let user mint if remaining in contract is 0
  const web3GetUserSaleState = useCallback(async () => {
    if (!phase) { return; }
    try {
      if (truthyOrZero(userMintedAmount) && maxAmountPerUser) {
        setCanMintAmount(Math.min(maxAmountPerUser - userMintedAmount, nftsRemaining));
      }
    } catch (e) {}
  }, [phase, userMintedAmount, maxAmountPerUser, nftsRemaining]);

  useEffect(() => {
    (async () => {
      await web3GetUserSaleState();
    })()
  }, [web3GetUserSaleState]);

  useEffect(() => {
    if (isConnected && phase && canMintAmount !== -1 && maxAmountPerUser) {
      if (phase === PHASE.PHASE_CLOSED) {
        setStatus('');
        return;
      } else if (![PHASE.PHASE_PUBLIC, PHASE.PHASE_WHITELIST].includes(phase)) {
        setStatus('The minting is in an unknown state.');
        return;
      } else {
        const statusMsg = getUserMintingAllowanceMsg(phase, canMintAmount, nftsRemaining);
        statusMsg && setStatus(statusMsg);
      }
    }
  }, [canMintAmount, isConnected, maxAmountPerUser, nftsRemaining, phase]);

  useEffect(() => {
    setCostOfMint(ethers.utils.parseUnits('' + cost * counter, 'ether'));
  }, [cost, counter]);

  const web3PerformPublicMint = useCallback(() => {
    if (!(walletAddress || isConnected || contract || canMintAmount > 0 || isCorrectChainId(chainId))) {
      return;
    }

    mint();
  }, [canMintAmount, chainId, contract, isConnected, mint, walletAddress]);

  const shouldDisableMintButton = useCallback(() => (
    !(isCorrectChainId(chainId) || [PHASE.PHASE_PUBLIC, PHASE.PHASE_WHITELIST].includes(phase)) ||
    isSoldOut(nftsRemaining, nftsMinted) ||
    canMintAmount <= 0
  ), [chainId, phase, nftsRemaining, nftsMinted, canMintAmount]);

  const shouldDisableCounter = useCallback(() => (
    !walletAddress ||
    ![PHASE.PHASE_PUBLIC, PHASE.PHASE_WHITELIST].includes(phase) ||
    nftsRemaining <= 1 ||
    canMintAmount <= 1 ||
    isMintLoading ||
    isMintStarted ||
    shouldDisableMintButton()
  ), [canMintAmount, isMintLoading, isMintStarted, nftsRemaining, phase, shouldDisableMintButton, walletAddress]);

  return (
    <div>
      {snackbarOpen && (
        <Notify
          closeSnackbar={closeSnackbar}
          error={(mintError as any)?.reason}
          severity={(mintError as any)?.reason ? 'error' : 'success'}
        />
      )}
      <Main>
        <Grid container>
          <Grid
            item
            xs={12}
          >
            <Header />
          </Grid>
          <Grid
            item
            xs={8}
            m={theme.spacing(0, 'auto')}
          >
            <SubHeader />
          </Grid>
        </Grid>
        <Grid container>
          <Grid
            item
            xs={11}
            bgcolor='background.default'
            m={theme.spacing(0, 'auto')}
          >
            <Paper>
              <Card>
                <div style={{ position: 'relative', minHeight: '65vh' }}>
                  <CardMedia
                    alt='Scissors NFT'
                    component='img'
                    image={require('../../scissors.png')}
                    sx={{ minHeight: '60vh' }}
                  />
                  <StackOverImage
                    sx={{
                      maxWidth: {
                        xsmobile: '200px',
                        tablet: '500px',
                      },
                      top: 10,
                    }}
                  >
                    <CardContent>
                      {contract && (
                        <Phase
                          isSoldOut={isSoldOut(nftsRemaining, nftsMinted)}
                          paused={!!paused}
                          phase={phase}
                        />
                      )}
                    </CardContent>
                    <CardActions>
                      <Stack>
                        {phase !== PHASE.PHASE_CLOSED && !paused && (
                          isConnected || isReconnecting ? (
                            <>
                              <BoxCounter
                                canMintAmount={canMintAmount}
                                counter={counter}
                                setCounter={setCounter}
                                shouldDisableCounter={shouldDisableCounter}
                              />
                              <MintButton
                                loading={isMintLoading || isMintStarted}
                                onClick={web3PerformPublicMint}
                                shouldDisableMintButton={shouldDisableMintButton}
                              />
                            </>
                          ) : (
                            <>
                              <Connect
                                buttonText={
                                  PHASE.PHASE_CLOSED === phase ||
                                  isSoldOut(nftsRemaining, nftsMinted)
                                    ? 'Connect'
                                    : 'Connect to mint'
                                }
                                isConnected={isConnected}
                                isConnecting={isConnecting}
                                rounded
                              />
                            </>
                          )
                        )}
                      </Stack>
                    </CardActions>
                  </StackOverImage>
                  <StackOverImage
                    sx={{
                      bottom: {
                        xsmobile: 0,
                        tablet: 50,
                      },
                      mb: 4,
                    }}
                  >
                    <Collapse
                      in={!!supplyLimit}
                      timeout={1000}
                    >
                      <CardContent>
                        {!!supplyLimit ? (
                          <MintStats
                            minted={nftsMinted}
                            total={supplyLimit}
                          />
                        ) : (
                          <LinearProgress variant='query' />
                        )}
                      </CardContent>
                    </Collapse>
                    <Collapse
                      in={!!(walletAddress && isCorrectChainId(chainId) && status)}
                      mountOnEnter
                      unmountOnExit
                      timeout={1000}
                    >
                      {!paused && <MintStatus status={status} />}
                    </Collapse>
                  </StackOverImage>
                </div>
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Main>
    </div>
  );
}

export default Home;

import '@rainbow-me/rainbowkit/styles.css';

import { connectorsForWallets, lightTheme, wallet } from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

import { APP_NAME, CHAIN_ID, CHAIN_IDS } from '../constants';
import { needsInjectedWalletFallback } from '../utils/wallet';
import { ThemeColor } from '../theme';

export const { chains, provider, webSocketProvider } = configureChains(
  CHAIN_ID === 4 ? [chain.rinkeby, chain.mainnet] : [chain.mainnet],
  [
    alchemyProvider({ alchemyId: CHAIN_IDS[CHAIN_ID]?.alchemyId }),
    infuraProvider({ infuraId: process.env.REACT_APP_INFURA_ID }),
    jsonRpcProvider({
      rpc: () => {
        return { http: CHAIN_IDS[CHAIN_ID]?.rpcUrl };
      },
    }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [wallet.metaMask({ chains, shimDisconnect: true })],
  },
  {
    groupName: 'Others',
    wallets: [
      wallet.rainbow({ chains }),
      wallet.coinbase({ appName: APP_NAME, chains }),
      wallet.walletConnect({ chains }),
      wallet.trust({ chains }),
      ...(needsInjectedWalletFallback
        ? [wallet.injected({ chains, shimDisconnect: true })]
        : []),
    ],
  },
]);

export const customTheme = lightTheme({
  accentColor: ThemeColor.crimson
});

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

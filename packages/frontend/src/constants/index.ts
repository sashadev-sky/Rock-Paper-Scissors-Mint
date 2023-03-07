import RPSCollection from '../generated/artifacts/contracts/RPS.sol/RPS.json';

import { AlchemySettings, Network } from 'alchemy-sdk';

/**
 * SEO and Contract Related Info
 */
export const APP_NAME = 'Rock, Paper, Scissors! NFT';
export const APP_SHORT_NAME = 'RPS';
export const INSTAGRAM_HANDLE = 'sashaboginsky';
export const OPENSEA_COLLECTION = 'rock-paper-and-scissors-nft';
export const TITLE = `${APP_SHORT_NAME} NFT | RockPaperScissors`;

/**
 * Network Related Info
 */
interface Chain {
  alchemy: AlchemySettings;
  name: string;
  proxyContractAddress: string;
  rpcUrl: string;
  etherScanUrl: string;
}
export const CHAIN_ID = 5;
export const GAS_LIMIT = 250000;
export const CHAIN_IDS: { [key: number]: Chain } = {
  1: {
    name: 'homestead',
    proxyContractAddress: process.env.REACT_APP_HOMESTEAD_PROXY_CONTRACT_ADDtRESS as string, // a proxy contract never changes its address
    alchemy: {
      apiKey: process.env.REACT_APP_ALCHEMY_MAINNET_KEY as string,
      network: Network.ETH_MAINNET,
    },
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
    etherScanUrl: 'https://etherscan.io',
  },
  5: {
    name: 'goerli',
    proxyContractAddress: process.env.REACT_APP_TESTNET_PROXY_CONTRACT_ADDRESS as string, // a proxy contract never changes its address
    alchemy: {
      apiKey: process.env.REACT_APP_ALCHEMY_TESTNET_KEY as string,
      network: Network.ETH_GOERLI,
    },
    rpcUrl: `https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
    etherScanUrl: 'https://goerli.etherscan.io',
  },
};

/**
 * Messages
 */
export const CONGRATULATIONS =
  'Congratulations! Please wait for up to 60 seconds for your NFT(s) to arrive in your wallet.';

/**
 * Contract
 */
export enum PHASE {
  PHASE_WHITELIST = 0,
  PHASE_PUBLIC = 1,
  PHASE_CLOSED = 2
}

export const CONTRACT_PARAMS = {
  addressOrName: CHAIN_IDS[CHAIN_ID].proxyContractAddress,
  contractInterface: RPSCollection.abi,
};

import RPSCollection from '../generated/artifacts/contracts/RPS.sol/RPS.json';

/**
 * SEO and Contract Related Info
 */
export const APP_NAME = 'Rock, Paper, Scissors! NFT';
export const APP_SHORT_NAME = 'RPS';
export const INSTAGRAM_HANDLE = 'sashaboginsky';
export const OPENSEA_COLLECTION = 'rock-paper-and-scissors-nft';
export const TITLE = 'RPS NFT | RockPaperScissors';

/**
 * Network Related Info
 */
interface Chain {
  name: string;
  proxyContractAddress: string;
  rpcUrl: string;
  alchemyBaseUrl: string;
  alchemyId: string;
  etherScanUrl: string;
}
export const CHAIN_ID = 4;
export const GAS_LIMIT = 250000;
export const CHAIN_IDS: { [key: number]: Chain } = {
  1: {
    name: 'homestead',
    proxyContractAddress: process.env.REACT_APP_HOMESTEAD_PROXY_CONTRACT_ADDRESS as string, // a proxy contract never changes its address
    rpcUrl: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
    alchemyBaseUrl: 'https://eth-mainnet.alchemyapi.io/v2/',
    alchemyId: process.env.REACT_APP_ALCHEMY_PRODUCTION_KEY as string,
    etherScanUrl: 'https://etherscan.io',
  },
  4: {
    name: 'rinkeby',
    alchemyId: process.env.REACT_APP_ALCHEMY_STAGING_KEY as string,
    alchemyBaseUrl: 'https://eth-rinkeby.alchemyapi.io/v2/',
    proxyContractAddress: process.env.REACT_APP_RINKEBY_PROXY_CONTRACT_ADDRESS as string, // a proxy contract never changes its address
    rpcUrl: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
    etherScanUrl: 'https://rinkeby.etherscan.io',
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

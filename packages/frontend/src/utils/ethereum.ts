import { ethers } from 'ethers';
import { ProviderRpcError } from 'hardhat/types/provider';

import { CHAIN_ID } from '../constants';

type ProviderErrorHandler = (err: ProviderRpcError) => void;

export const weiToEther = (wei: ethers.BigNumberish) => (
  +ethers.utils.formatEther(wei) * 1000000000000000000
)

export const isCorrectChainId = (chainId: number | null | undefined) => !!(chainId && chainId === CHAIN_ID);

export const isMetaMaskInstalled = () => {
  // Have to check the ethereum binding on the window object to see if it's installed
  const { ethereum } = window;
  return Boolean(ethereum && ethereum.isMetaMask);
};

export const requestAccounts = async (
  provider: any,
  errorHandler: ProviderErrorHandler = (err) => {
    console.warn(err);
  }
) =>
  provider?.request &&
  (await provider
    .request({
      method: 'eth_requestAccounts',
    })
    .then((res: any) => res)
    .catch((error: any) => errorHandler(error)));

export const toHex = (num: number | string) => {
  const val = Number(num);
  return '0x' + val.toString(16);
};

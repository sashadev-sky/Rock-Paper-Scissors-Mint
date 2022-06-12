import { ethers } from 'ethers';

import { CHAIN_ID } from '../constants';

export const isCorrectChainId = (chainId: number | null | undefined) => !!(chainId && chainId === CHAIN_ID);

export const weiToEther = (wei: ethers.BigNumberish) => (
  +ethers.utils.formatEther(wei) * 1000000000000000000
)

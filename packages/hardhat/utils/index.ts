import { BigNumber, utils } from 'ethers';
import { formatUnits } from 'ethers/lib/utils';

const { isAddress, getAddress } = utils;

export const findFirstAddr = (addr: string) => {
  if (isAddress(addr)) { return getAddress(addr); }
  throw `Could not normalize address: ${addr}`;
};

export const prettyPrintBalance = (balance: BigNumber) => `${weiToEth(balance)} ETH`

const weiToEth = (balance: BigNumber) => formatUnits(balance, 'ether')

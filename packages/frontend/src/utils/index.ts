import { PHASE } from '../constants/index';

export const getShortWalletAddress = (walletAddress: string) =>
  `${walletAddress.substring(0, 5)}...${walletAddress.substring(
    walletAddress.length - 4,
    walletAddress.length
  )}`;

export const getUserMintingAllowanceMsg = (
  phase: number,
  remaining: number,
  nftsRemaining: number
) => {
  if (phase === PHASE.PHASE_CLOSED || nftsRemaining === 0) {
    return 'Public Sale has been closed';
  } else if (remaining) {
    return `You can mint up to ${remaining} nft(s).`;
  } else {
    if (phase === PHASE.PHASE_WHITELIST) {
      return 'You have hit the mint limit for our whitelist. Check in later for the public sale!';
    } else if (phase === PHASE.PHASE_PUBLIC) {
      return 'You have minted all of your NFTS.';
    }
  }
  return '';
};

export const truthyOrZero = (value: number | undefined) => (
  !!(value || value === 0)
);

import { PHASE } from '../constants';

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

export const isSoldOut = (nftsRemaining: number, nftsMinted: number) =>
  nftsRemaining === 0 && nftsMinted > 0;

export const isMintablePhase = (phase: number) =>
  [PHASE.PHASE_WHITELIST, PHASE.PHASE_PUBLIC].includes(phase);

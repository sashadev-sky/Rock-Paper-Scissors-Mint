export const isSoldOut = (nftsRemaining: number, nftsMinted: number) => (
  nftsRemaining === 0 && nftsMinted > 0
);
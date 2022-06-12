export const getShortWalletAddress = (walletAddress: string) => (
  `${walletAddress.substring(0, 5)}...${walletAddress.substring(
    walletAddress.length - 4,
    walletAddress.length
  )}`
);

export const needsInjectedWalletFallback = (
  typeof window !== 'undefined' &&
  window.ethereum &&
  !window.ethereum.isMetaMask &&
  !window.ethereum.isCoinbaseWallet
);

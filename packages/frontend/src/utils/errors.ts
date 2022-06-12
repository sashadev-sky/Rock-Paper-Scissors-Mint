import { ProviderRpcError } from 'hardhat/types/provider';
import { BigNumber, ethers } from 'ethers';

export const catchAndParse = (
  error: ProviderRpcError | Error | DOMException | string,
  costOfMint?: BigNumber | number,
  counter?: number,
) => {
  let message = '';
  if (typeof error === 'string') {
    if (error !== 'Modal closed by user')
    message = error;
  } else {
    const { code, message: errMessage } = error as any;
    if (errMessage === 'No Web3 Provider found') {
      message = errMessage
    } else if (code) {
      if ([4001, 'UNSUPPORTED_OPERATION', 'INVALID_ARGUMENT'].includes(code)) {
        message = 'Error: Please connect your wallet';
      } else if (code === -32002) {
        message = 'Error: Please check your wallet for a pending request to connect.';
      }
    } else if (!(error instanceof DOMException)) {
      const { message: errMessage } = error as Error;
      if (errMessage === 'User Rejected') {
        message = errMessage === 'User Rejected'
          ? 'Failed to connect: User denied account authorization'
          : errMessage;
      }
    }
  }

  if (message.includes('Signature has already')) {
    return 'You have already minted your NFT(s)! Please check your OpenSea collection.'
  } else if (message.includes('insufficient') && (costOfMint || costOfMint === 0)  && (counter || counter === 0)) {
    return(
      'You must have at least ' +
        (+ethers.utils.formatEther(costOfMint)).toFixed(2) +
        ' ETH to mint ' +
        counter +
        ' NFT(s)!'
    );
  } else {
    return message;
  }
}

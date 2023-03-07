import { useCallback, useEffect, useState } from 'react';
import { Card, Collapse, Divider, Typography, useTheme } from '@mui/material';
import { Alchemy, Nft, NftContractNftsResponse } from 'alchemy-sdk';

import { CHAIN_ID, CHAIN_IDS } from '../../../constants';

import styles from './NftGallery.module.css';

interface Props {
  chainId?: number | undefined;
  minted: number;
}

const NftGallery = ({ chainId = CHAIN_ID, minted }: Props) => {
  const { palette } = useTheme();
  const [nfts, setNfts] = useState<Nft[]>([]);
  const alchemy = new Alchemy(CHAIN_IDS[chainId].alchemy);

  const getNftsForCollection = useCallback(async () => {
    try {
      const res: NftContractNftsResponse = await alchemy.nft.getNftsForContract(
        process.env.REACT_APP_TESTNET_PROXY_CONTRACT_ADDRESS as string
      );

      setNfts(res.nfts);
    } catch (e) {
      console.log(e);
    }
  }, [alchemy.nft]);

  useEffect(() => {
    if (minted !== nfts.length) {
      getNftsForCollection();
    }
  }, [getNftsForCollection, minted, nfts]);

  return (
    <Collapse in={!!nfts.length} timeout={1000}>
      <div className={styles.nft_gallery_page}>
        <div className={styles.nft_gallery}>
          <div className={styles.nfts_display}>
            <Card sx={{ bgColor: palette.background.default }} className={styles.card_container}>
              <Typography sx={{ filter: 'saturate(0.65)', mt: 4, mb: 2 }} variant='h5'>
                Minted Gallery
              </Typography>
              <Typography sx={{ filter: 'saturate(0.65)', mt: 4, mb: 2 }} variant='h5'>
                Count: {minted}
              </Typography>
            </Card>
            {nfts
              .filter(({ rawMetadata }) => !!rawMetadata?.image)
              .map((nft) => (
                <NftCard key={nft.tokenId} nft={nft} />
              ))}
          </div>
        </div>
      </div>
    </Collapse>
  );
};

const NftCard = ({ nft }: { nft: Nft }) => {
  const { palette } = useTheme();

  return (
    <Card sx={{ bgColor: palette.background.default }} className={styles.card_container}>
      <div className={styles.image_container}>
        <img alt={nft.title} src={nft.rawMetadata!.image} />
      </div>
      <div className={styles.info_container}>
        <Typography
          display='flex'
          sx={{ filter: 'saturate(0.65)' }}
          variant='h6'
          className='fat-frank'
        >
          {nft.title.length > 20 ? `${nft.title.substring(0, 15)}...` : nft.title}
        </Typography>
        <Divider />
        <div className={styles.description_container}>
          <Typography variant='subtitle1' className='fat-frank' color={palette.info.main}>
            {nft.description}
          </Typography>
        </div>
        <hr />
      </div>
    </Card>
  );
};

export default NftGallery;

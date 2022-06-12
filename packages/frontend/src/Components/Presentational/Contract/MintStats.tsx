import {
  Stack,
  Theme,
  Typography,
  useMediaQuery
} from '@mui/material';

import GradientText from '../../Styled/GradientText';

interface Props {
  minted: number;
  total: number;
}

const MintStats = ({ minted, total }: Props) => {
  const bP = useMediaQuery((theme: Theme) => theme.breakpoints.between('xsmobile', 'mobile'));

  return (
    <Stack
      alignItems='center'
      className='fat-frank'
      direction={bP ? 'row' : 'column'}
      spacing={bP ? 1 : 0}
    >
      <Typography color='text.secondary' variant='h4'>
        {minted} / {total} NFTs{' '}
      </Typography>
      <GradientText variant='h4'>
        minted
      </GradientText>
    </Stack>
  );
};

export default MintStats;

import { Typography } from '@mui/material';

const SubHeader = () => (
  <Typography
    color='text.primary'
    sx={{ filter: 'saturate(0.65)' }}
    variant='h6'
    mt={2}
    mb={3}
  >
    Rock, Paper, and Scissors...
  </Typography>
);

export default SubHeader;

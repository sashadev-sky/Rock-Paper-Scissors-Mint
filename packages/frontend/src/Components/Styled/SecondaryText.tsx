import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const SecondaryText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

export default SecondaryText;

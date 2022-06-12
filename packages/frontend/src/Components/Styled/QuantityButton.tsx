import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const QuantityButton = styled(Button)(({ theme }) => ({
  border: '1px solid',
  width: 48,
  minWidth: 48,
  height: 48,
  '&:hover': {
    svg: {
      [theme.breakpoints.up('md')]: {
        transform: 'scale(1.3)',
      },
    },
  },
  [theme.breakpoints.down('md')]: {
    width: 30,
    minWidth: 30,
    height: 30,
  },
}));

export default QuantityButton;

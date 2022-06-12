import { Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StackOverImage = styled(Stack)(() => ({
  alignItems: 'center',
  left: '50%',
  paddingLeft: 0,
  paddingRight: 0,
  position: 'absolute',
  transform: 'translateX(-50%)',
  width: '100%'
}));

export default StackOverImage;

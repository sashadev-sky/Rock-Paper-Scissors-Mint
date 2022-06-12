import { styled } from '@mui/material/styles';

const Main = styled('main')(() => ({
  backgroundColor: 'background.default',
  display: 'flex',
  filter: 'saturate(1.5)',
  flexDirection: 'column',
  flexGrow: 1,
}));

export default Main;

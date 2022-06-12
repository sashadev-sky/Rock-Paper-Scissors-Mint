import { SvgIcon } from '@mui/material';

const InstagramIcon = () => {
  return (
    <SvgIcon
      sx={{ fill: 'none' }}
      fontSize='inherit'
      stroke='white'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
      viewBox='0 0 24 24'
      width='24'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect height='20' rx='5' width='20' x='2' y='2' />
      <path d='m16 11.37a4 4 0 1 1 -3.37-3.37 4 4 0 0 1 3.37 3.37z' />
      <path d='m17.5 6.5h.01' />
    </SvgIcon>
  );
};

export default InstagramIcon;

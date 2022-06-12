import { Typography } from '@mui/material';

interface Props {
  color?: string;
  mobile: boolean;
  message: number;
}

const Display = ({ color = 'inherit', mobile, message }: Props) => (
  <Typography
    className='trade-gothic'
    sx={{ color, fontSize: mobile ? '1rem' : '1.5rem', mt: 1 }}
    variant='overline'
  >
    {message}
  </Typography>
);

export default Display;

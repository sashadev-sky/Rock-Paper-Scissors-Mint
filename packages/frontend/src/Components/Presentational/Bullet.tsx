import { Typography, TypographyProps } from '@mui/material';

type BulletNumberProps = TypographyProps & { sequence?: number };

const Bullet = (props: BulletNumberProps) => {
  const { children } = props;
  return (
    <Typography
      component='span'
      color='common.white'
      variant='h6'
    >
      {children}
    </Typography>
  );
};

export default Bullet;

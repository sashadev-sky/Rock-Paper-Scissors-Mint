import { Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

type GraidentTextProps = {
  direction?: 'left' | 'right';
};

const GradientText = styled(Typography)<GraidentTextProps>(({ theme, direction = 'right' }) => {
  const alpha1 = alpha(theme.palette.text.secondary, 0.3);
  const alpha2 = theme.palette.text.secondary;
  return {
    background: `linear-gradient(to ${direction}, ${alpha1}, ${alpha2})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };
});

export default GradientText;

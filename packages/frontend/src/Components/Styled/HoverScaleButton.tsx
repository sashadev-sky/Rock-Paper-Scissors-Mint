import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { HTMLAttributes } from 'react';

import { TRANSFORMS } from '../../constants/styling';

type HoverScaleButtonProps = LoadingButtonProps & HTMLAttributes<HTMLButtonElement>;

const StyledHoverScaleButton = styled(LoadingButton)((({ theme }) => (props) => {
  const fillOnHover = props.variant && props.variant !== 'outlined';
  const fillColor = props.color && props.color !== 'inherit'
    ? theme.palette[props.color].main
    : props.color;
  return {
    ariaLabel: props['aria-label'],
    borderRadius: 50,
    boxShadow: theme.shadows[0],
    '&:active': {
      boxShadow: theme.shadows[0],
      transform: TRANSFORMS.shrink,
      transition: TRANSFORMS.shrinkTransition,
    },
    '&:focus-visible': {
      boxShadow: theme.shadows[0],
      transform: TRANSFORMS.shrink,
      transition: TRANSFORMS.shrinkTransition,
    },
    '&:hover': {
      backgroundColor: fillOnHover && fillColor ? fillColor : 'initial',
      boxShadow: theme.shadows[0],
      transform: TRANSFORMS.grow,
      transition: TRANSFORMS.growTransition,
    },
    willChange: 'transform',
  };
}));

const HoverScaleButton = (props: HoverScaleButtonProps) => {
  const { children, ...rest } = props;
  const aria = props['aria-label'] || (children as string);
  return (
    <StyledHoverScaleButton
      {...rest}
      aria-label={aria}
    >
      <Typography variant='button'>
        {children}
      </Typography>
    </StyledHoverScaleButton>
  );
}

export default HoverScaleButton;

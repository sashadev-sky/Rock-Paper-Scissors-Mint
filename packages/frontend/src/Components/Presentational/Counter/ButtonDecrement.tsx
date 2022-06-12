import RemoveIcon from '@mui/icons-material/Remove';
import QuantityButton from '../../Styled/QuantityButton';

interface Props {
  color?: string;
  disabled: boolean;
  mobile: boolean;
  onClick: () => void;
}

const ButtonDecrement = ({
  color = 'inherit',
  disabled,
  mobile,
  onClick,
}: Props) => {
  return (
    <QuantityButton
      disabled={disabled}
      size={mobile ? 'small' : 'large'}
      aria-label='remove'
      onClick={onClick}
      sx={{ color }}
    >
      <RemoveIcon />
    </QuantityButton>
  );
};

export default ButtonDecrement;

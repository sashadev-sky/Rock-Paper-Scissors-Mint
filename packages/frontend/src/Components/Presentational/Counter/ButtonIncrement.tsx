import AddIcon from '@mui/icons-material/Add';

import QuantityButton from '../../Styled/QuantityButton';

interface Props {
  color?: string;
  disabled: boolean;
  mobile: boolean;
  onClick: () => void;
}

const ButtonIncrement = ({
  color = 'inherit',
  disabled,
  mobile,
  onClick
}: Props) => (
  <QuantityButton
    disabled={disabled}
    size={mobile ? 'small' : 'large'}
    aria-label='add'
    onClick={onClick}
    sx={{ color }}
  >
    <AddIcon />
  </QuantityButton>
);

export default ButtonIncrement;

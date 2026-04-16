import type { ButtonProps } from './type';
import { getButtonStyle } from './style';

export default function Button({
  variant = 'default',
  size = 40,
  paddingX,
  width,
  fullWidth = false,
  isLoading = false,
  disabled = false,
  circleSize = 48,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled || isLoading);

  const buttonStyle = getButtonStyle({
    variant,
    size,
    width,
    fullWidth,
    disabled: isDisabled,
    paddingX,
    className,
    circleSize,
  });

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={buttonStyle.className}
      style={buttonStyle.style}
      {...rest}
    >
      {children}
    </button>
  );
}

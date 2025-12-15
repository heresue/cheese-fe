import type { ButtonProps } from './type';
import { getButtonStyle } from './style';

export default function Button({
  variant = 'contained',
  width,
  height,
  size,
  isLoading = false,
  disabled,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled || isLoading);

  const buttonStyle = getButtonStyle({
    variant,
    width,
    height,
    size,
    className,
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

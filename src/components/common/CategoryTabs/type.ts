export type CategoryTabsSize = 'sm' | 'md';

export type CategoryTabItem<TValue extends string = string> = {
  label: string;
  value: TValue;
  disabled?: boolean;
};

export type CategoryTabsProps<TValue extends string = string> = {
  items: readonly CategoryTabItem<TValue>[];
  activeValue: TValue;
  onChange: (value: TValue) => void;
  size?: CategoryTabsSize;
  className?: string;
};

'use client';

import { categoryTabsClassNames as styles } from './style';
import type { CategoryTabsProps } from './type';

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function CategoryTabs<TValue extends string = string>({
  items,
  activeValue,
  onChange,
  size = 'md',
  className,
}: CategoryTabsProps<TValue>) {
  return (
    <div className={cn(styles.list, className)} role="tablist">
      {items.map((item) => {
        const isActive = item.value === activeValue;

        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            disabled={item.disabled}
            className={cn(
              styles.buttonBase,
              styles.buttonSize[size],
              isActive ? styles.active : styles.inactive,
            )}
            onClick={() => onChange(item.value)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

export default CategoryTabs;

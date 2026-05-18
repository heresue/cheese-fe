import type { ProblemSubCategory } from '../types/problem';

type ProblemSubCategoryTabItem = {
  label: string;
  value: ProblemSubCategory;
};

type ProblemSubCategoryTabsProps = {
  items: readonly ProblemSubCategoryTabItem[];
  activeValue: ProblemSubCategory;
  onChange: (value: ProblemSubCategory) => void;
};

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

export default function ProblemSubCategoryTabs({
  items,
  activeValue,
  onChange,
}: ProblemSubCategoryTabsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-[28px]">
      {items.map((item) => {
        const isActive = item.value === activeValue;

        return (
          <button
            key={item.value}
            type="button"
            className={cn(
              'font-sans text-[13px] leading-[20px] tracking-[-0.02em]',
              isActive ? 'text-secondary-800 font-semibold' : 'font-medium text-gray-700',
            )}
            onClick={() => {
              onChange(item.value);
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

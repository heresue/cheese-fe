import { Button } from '@/components/common/Button';

import { cn } from '@/lib/cn';

type CommunityListStateProps = {
  type: 'loading' | 'error' | 'empty';
  message: string;
  onRetry?: () => void;
};

export default function CommunityListState({ type, message, onRetry }: CommunityListStateProps) {
  const isLoading = type === 'loading';

  return (
    <div
      className={cn(
        'mb-8 flex flex-1 flex-col items-center justify-center rounded-[10px] p-8 text-center',
        !isLoading && 'border-border border',
      )}
    >
      <p className="text-text-muted text-[15px] leading-[22px] font-medium">{message}</p>

      {type === 'error' && onRetry && (
        <Button type="button" onClick={onRetry} width={120} className="mt-4">
          다시 시도
        </Button>
      )}
    </div>
  );
}

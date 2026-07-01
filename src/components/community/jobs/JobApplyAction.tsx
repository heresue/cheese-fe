import { Button } from '@/components/common/Button';

import { APPLY_LABEL } from './constants';

import type { ApplyInfo } from '@/types/community';

export default function JobApplyAction({
  apply,
  onDirectApply,
}: {
  apply: ApplyInfo;
  onDirectApply: () => void;
}) {
  if (apply.type === 'homepage') {
    return (
      <Button asChild width={100}>
        <a href={apply.url} target="_blank" rel="noopener noreferrer">
          {APPLY_LABEL[apply.type]}
        </a>
      </Button>
    );
  }

  return (
    <Button width={100} variant="outlineGray" onClick={onDirectApply}>
      {APPLY_LABEL[apply.type]}
    </Button>
  );
}

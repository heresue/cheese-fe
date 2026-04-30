import Link from 'next/link';
import { Button } from '@/components/common/Button';
import { ApplyInfo } from './types';

const APPLY_LABEL = {
  homepage: '홈페이지 지원',
  direct: '직접지원',
};

export default function JobApplyAction({
  apply,
  onDirectApply,
}: {
  apply: ApplyInfo;
  onDirectApply: () => void;
}) {
  if (apply.type === 'homepage') {
    return (
      <Link href={apply.url}>
        <Button width={100}>{APPLY_LABEL[apply.type]}</Button>
      </Link>
    );
  }

  return (
    <Button width={100} variant="outlineGray" onClick={onDirectApply}>
      {APPLY_LABEL[apply.type]}
    </Button>
  );
}

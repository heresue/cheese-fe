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
      // <Link href={apply.url}>
      //   <Button width={100}>{APPLY_LABEL[apply.type]}</Button>
      // </Link>
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

import { Chip } from '@/components/common/Chip';

export default function TestPage() {
  return (
    <div className="flex flex-col gap-10 p-10">
      <h1 className="text-2xl font-bold">Chip Test</h1>
      <div className="flex flex-col items-start gap-4">
        <div>
          <h2 className="font-medium">1. Variant: default</h2>
          <div className="bg-primary-800 ml-3 flex h-8 w-12 items-center justify-center">
            <Chip>FE</Chip>
          </div>
        </div>
        <div>
          <h2 className="font-medium">2. Variant: FE</h2>
          <div className="ml-3 flex h-8 w-12 items-center">
            <Chip variant="FE">FE</Chip>
          </div>
        </div>
        <div>
          <h2 className="font-medium">3. Variant: BE</h2>
          <div className="ml-3 flex h-8 w-12 items-center">
            <Chip variant="BE">BE</Chip>
          </div>
        </div>
        <div>
          <h2 className="font-medium">4. Variant: interview</h2>
          <div className="ml-3 flex h-8 w-12 items-center">
            <Chip variant="interview">면접일정</Chip>
          </div>
        </div>
        <div>
          <h2 className="font-medium">5. Variant: document</h2>
          <div className="ml-3 flex h-8 w-12 items-center">
            <Chip variant="document">서류접수</Chip>
          </div>
        </div>
        <div>
          <h2 className="font-medium">6. Variant: personal</h2>
          <div className="ml-3 flex h-8 w-12 items-center">
            <Chip variant="personal">개인일정</Chip>
          </div>
        </div>
      </div>
    </div>
  );
}

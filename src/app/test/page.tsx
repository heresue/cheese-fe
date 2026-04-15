import { AlarmIcon } from '@/assets/icons/sidebar';
import Button from '@/components/common/Button/Button';

function MockIcon() {
  return <span className="inline-block h-4 w-4 rounded-full bg-current" aria-hidden="true" />;
}

const sizes = [54, 46, 44, 40, 38, 30] as const;

export default function ButtonTestPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-5">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Button UI Test</h1>
        </header>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">1. Size(height) & Variant</h2>
          <div className="flex flex-col gap-4">
            {sizes.map((size) => (
              <div key={size} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium text-gray-600">{size}px</div>
                <Button size={size} variant="default" width={100}>
                  Default
                </Button>
                <Button size={size} variant="light" width={100}>
                  Light
                </Button>
                <Button size={size} variant="outline" width={100}>
                  Outline
                </Button>
                <Button size={size} variant="outlineGray" width={150}>
                  Outline Gray
                </Button>
                <Button size={size} variant="outlineLightGray" width={200}>
                  Outline Light Gray
                </Button>
                <Button size={size} variant="gray" width={100}>
                  Gray
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">2. Disabled</h2>
          <div className="flex gap-4">
            <Button variant="default" width={150} disabled>
              Default
            </Button>
            <Button variant="light" width={150} disabled>
              Light
            </Button>
            <Button variant="outline" width={200} className="flex gap-[10px]" disabled>
              <AlarmIcon width={16} height={16} className="text-secondary-500" />
              Outline (with Icon)
            </Button>
            <Button variant="outlineGray" width={150} disabled>
              Outline Gray
            </Button>
            <Button variant="outlineLightGray" width={150} size={38} disabled>
              Outline Light Gray
            </Button>
            <Button variant="gray" width={150} disabled>
              Gray
            </Button>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            3. Circle Button (disabled 일 경우, 색상 변경 X)
          </h2>
          <Button variant="circle" className="bg-primary-800" aria-label="추가 32">
            <MockIcon />
          </Button>
        </section>
      </div>
    </main>
  );
}

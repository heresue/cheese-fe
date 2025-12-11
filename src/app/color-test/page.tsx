export default function Home() {
  const primary = [
    '--color-primary-0',
    '--color-primary-10',
    '--color-primary-30',
    '--color-primary-50',
    '--color-primary-100',
    '--color-primary-200',
    '--color-primary-300',
    '--color-primary-400',
  ];

  const secondary = [
    '--color-secondary-0',
    '--color-secondary-10',
    '--color-secondary-30',
    '--color-secondary-50',
    '--color-secondary-100',
    '--color-secondary-200',
    '--color-secondary-300',
    '--color-secondary-400',
  ];

  const neutral = [
    '--color-bw-0',
    '--color-bw-100',
    '--color-bw-200',
    '--color-bw-300',
    '--color-bw-400',
    '--color-bw-500',
  ];

  const error = ['--color-error-50', '--color-error-100'];

  const renderRow = (label: string, tokens: string[]) => (
    <div style={{ marginBottom: '32px' }}>
      <h2
        style={{
          fontSize: '20px',
          fontWeight: 600,
          marginBottom: '12px',
        }}
      >
        {label}
      </h2>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        {tokens.map((token) => (
          <div
            key={token}
            style={{
              width: 60,
              height: 60,
              borderRadius: 999,
              backgroundColor: `var(${token})`,
              border: '1px solid #ccc',
            }}
            title={token}
          />
        ))}
      </div>
    </div>
  );

  return (
    <main style={{ padding: '40px' }}>
      <h1
        style={{
          fontSize: '32px',
          fontWeight: 700,
          marginBottom: '24px',
        }}
      >
        Cheese Global Theme Test
      </h1>

      <p style={{ marginBottom: '32px' }}>
        globals.css에 선언한 @theme 색상 토큰이 정상적으로 작동하는지 확인하세요.
      </p>

      {renderRow('Primary', primary)}
      {renderRow('Secondary', secondary)}
      {renderRow('Neutral (BW)', neutral)}
      {renderRow('Error', error)}
    </main>
  );
}

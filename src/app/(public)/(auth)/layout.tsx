export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center px-4">
      <div className="w-full max-w-[446px]">{children}</div>
    </div>
  );
}

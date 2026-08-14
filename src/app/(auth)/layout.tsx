import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="font-display text-xl font-semibold mb-8">
        duka<span className="text-brand">.</span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-black/10 px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-black/60">
        <p>Duka</p>
        <nav className="flex items-center gap-4">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-black/10 px-6 py-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link className="text-lg font-semibold" href="/">
          Duka
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/shop">Shop</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/deals">Deals</Link>
          <Link href="/cart">Cart</Link>
        </div>
      </nav>
    </header>
  );
}

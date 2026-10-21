import Link from "next/link";
import { CartButton } from "@/components/CartButton";
import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="Home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium sm:gap-4">
          <Link href="/shop" className="rounded px-2 py-1 hover:text-accent">
            Shop
          </Link>
          <Link href="/legal/research-use" className="hidden rounded px-2 py-1 hover:text-accent sm:inline">
            Research use
          </Link>
          <CartButton />
        </nav>
      </div>
    </header>
  );
}

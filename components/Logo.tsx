import Image from "next/image";
import { site } from "@/config/site";

export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    // "Still horizon": sun over a flat waterline, reflection fading below.
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#0f1b2d" />
      <circle cx="16" cy="14" r="4.2" fill="#5fc6cf" />
      <rect x="5" y="17.2" width="22" height="1.4" rx="0.7" fill="#fff" />
      <rect x="9" y="20.6" width="14" height="1.2" rx="0.6" fill="#5fc6cf" opacity="0.85" />
      <rect x="12" y="23.6" width="8" height="1.1" rx="0.55" fill="#5fc6cf" opacity="0.6" />
    </svg>
  );
}

/** Wordmark from /public/brand/logo.png (transparent, 1948×260). */
export function Logo({ className = "h-5 w-auto sm:h-8", priority = true }: { className?: string; priority?: boolean }) {
  return <Image src="/brand/logo.png" alt={site.name} width={1948} height={260} priority={priority} className={className} />;
}

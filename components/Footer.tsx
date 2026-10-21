import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/config/site";
import { legalDocs } from "@/lib/legal";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-surface">
      <div className="container-x grid gap-10 py-12 sm:grid-cols-3">
        <div>
          <Logo className="h-6 w-auto" priority={false} />
          <p className="mt-3 text-sm text-ink-soft">{site.tagline}.</p>
          <p className="mt-3 text-sm text-ink-soft">
            <a href={`mailto:${site.supportEmail}`} className="hover:text-accent">
              {site.supportEmail}
            </a>
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold">Policies</h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {Object.entries(legalDocs).map(([slug, doc]) => (
              <li key={slug}>
                <Link href={`/legal/${slug}`} className="hover:text-accent">
                  {doc.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xs leading-relaxed text-ink-soft">
          <p className="font-semibold text-ink">Research use only</p>
          <p className="mt-2">
            All products are sold strictly for in-vitro laboratory research. They are not drugs, foods, supplements or
            cosmetics, have not been evaluated by the FDA, and are not intended to diagnose, treat, cure or prevent any
            disease. Not for human or veterinary use. Purchasers must be {site.minAge}+.
          </p>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}

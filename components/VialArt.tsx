import type { Product } from "@/lib/catalog";

// Rendered unlabeled vial with the product name printed on the glass.
// Used for any product without a photo in `product.image`.

function labelLines(name: string) {
  const text = name.toUpperCase();
  if (text.length <= 12) return [text];
  const plus = text.indexOf(" + ");
  if (plus > 0) return [text.slice(0, plus), text.slice(plus + 1)];
  // Break at the space that gives the most balanced two lines.
  let best = -1;
  for (let i = text.indexOf(" "); i > 0; i = text.indexOf(" ", i + 1)) {
    if (best < 0 || Math.max(i, text.length - i - 1) < Math.max(best, text.length - best - 1)) best = i;
  }
  return best > 0 ? [text.slice(0, best), text.slice(best + 1)] : [text];
}

function labelAmount(product: Product) {
  if (product.composition) return `${product.composition.map((c) => c.amount.replace(/\s*mg$/i, "")).join("/")} MG`;
  return product.variants[0].amount.toUpperCase();
}

export function VialArt({ product, className = "" }: { product: Product; className?: string }) {
  const id = `vial-${product.slug}`;
  const lines = labelLines(product.vialName ?? product.name);
  const longest = Math.max(...lines.map((l) => l.length));
  const fontSize = Math.min(10.5, 66 / (0.62 * longest));
  const liquid = !product.form.startsWith("Lyophilized");
  const nameTop = lines.length === 1 ? 128 : 121;
  const amount = labelAmount(product);

  return (
    <svg viewBox="0 0 120 210" className={className} role="img" aria-label={`${product.name} vial`}>
      <defs>
        <linearGradient id={`${id}-cap`} x1="0" x2="1">
          <stop offset="0" stopColor="#4b5563" />
          <stop offset="0.35" stopColor="#d4d8de" />
          <stop offset="0.6" stopColor="#8b929c" />
          <stop offset="1" stopColor="#3f4650" />
        </linearGradient>
        <linearGradient id={`${id}-crimp`} x1="0" x2="1">
          <stop offset="0" stopColor="#8a9099" />
          <stop offset="0.28" stopColor="#f4f5f7" />
          <stop offset="0.55" stopColor="#a7adb5" />
          <stop offset="0.8" stopColor="#e4e7eb" />
          <stop offset="1" stopColor="#6b7178" />
        </linearGradient>
        <linearGradient id={`${id}-glass`} x1="0" x2="1">
          <stop offset="0" stopColor="#c3ccd5" stopOpacity="0.95" />
          <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="0.65" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="1" stopColor="#aab5c0" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* floor shadow */}
      <ellipse cx="60" cy="205" rx="44" ry="3.5" fill="#0f1b2d" opacity="0.15" />

      {/* glass body */}
      <path
        d="M37 46 C37 54 20 54 20 63 L20 195 Q20 203 28 203 L92 203 Q100 203 100 195 L100 63 C100 54 83 54 83 46 Z"
        fill={`url(#${id}-glass)`}
        stroke="#9eabb8"
        strokeWidth="1"
      />

      {liquid ? (
        <>
          {/* liquid fill */}
          <path d="M21.5 92 L98.5 92 L98.5 195 Q98.5 201.5 92 201.5 L28 201.5 Q21.5 201.5 21.5 195 Z" fill="#cfe6ee" opacity="0.45" />
          <rect x="21.5" y="91" width="77" height="2" fill="#a9cbd8" opacity="0.7" />
        </>
      ) : (
        <>
          {/* lyophilized cake */}
          <path d="M23 183 Q60 177 97 183 L97 196 Q97 200 92 200 L28 200 Q23 200 23 196 Z" fill="#f7f9fb" />
          <path d="M23 183 Q60 177 97 183" fill="none" stroke="#dfe5ea" strokeWidth="1" />
        </>
      )}

      {/* glass highlights */}
      <rect x="25" y="62" width="4.5" height="132" rx="2.25" fill="#ffffff" opacity="0.55" />
      <rect x="93" y="66" width="2" height="124" rx="1" fill="#ffffff" opacity="0.3" />

      {/* name printed directly on the glass (no label yet) */}
      {lines.map((line, i) => (
        <text
          key={i}
          x="60"
          y={nameTop + i * (fontSize + 2)}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="700"
          fill="#0f1b2d"
          opacity="0.88"
          fontFamily="sans-serif"
        >
          {line}
        </text>
      ))}
      <text
        x="60"
        y={nameTop + lines.length * (fontSize + 2) + 5}
        textAnchor="middle"
        fontSize="6.6"
        fontWeight="600"
        fill="#46566b"
        fontFamily="sans-serif"
        letterSpacing="0.6"
      >
        {amount}
      </text>

      {/* neck + crimp cap */}
      <rect x="37" y="38" width="46" height="10" fill={`url(#${id}-glass)`} stroke="#9eabb8" strokeWidth="1" />
      <rect x="31" y="16" width="58" height="25" rx="3" fill={`url(#${id}-crimp)`} />
      {[38, 46, 54, 62, 70, 78].map((x) => (
        <rect key={x} x={x} y="18" width="1" height="21" fill="#000" opacity="0.08" />
      ))}
      <rect x="31" y="37" width="58" height="4" rx="1.5" fill="#000" opacity="0.12" />
      <rect x="35" y="6" width="50" height="12" rx="4" fill={`url(#${id}-cap)`} />
    </svg>
  );
}

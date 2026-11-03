import Image from "next/image";
import type { Pattern, Product } from "@/lib/catalog";

// Placeholder "photography" until the owner's product images arrive: a
// fabric-textured card in the product's colour with the house monogram.
// Set `image` on a product in lib/catalog.ts to replace it with a photo.

function isLight(hex: string): boolean {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  return 0.299 * r + 0.587 * g + 0.114 * b > 150;
}

function texture(pattern: Pattern, ink: string): string | undefined {
  switch (pattern) {
    case "pinstripe":
      return `repeating-linear-gradient(90deg, ${ink} 0 1px, transparent 1px 14px)`;
    case "check":
      return [
        `repeating-linear-gradient(0deg, ${ink} 0 2px, transparent 2px 26px)`,
        `repeating-linear-gradient(90deg, ${ink} 0 2px, transparent 2px 26px)`,
      ].join(", ");
    case "herringbone":
      return [
        `repeating-linear-gradient(45deg, ${ink} 0 1px, transparent 1px 7px)`,
        `repeating-linear-gradient(-45deg, ${ink} 0 1px, transparent 1px 7px)`,
      ].join(", ");
    case "brocade":
      return [
        `radial-gradient(circle at 50% 50%, ${ink} 0 2px, transparent 2.5px)`,
        `radial-gradient(circle at 0 0, ${ink} 0 1px, transparent 1.5px)`,
      ].join(", ");
    case "linen":
      return [
        `repeating-linear-gradient(0deg, ${ink} 0 1px, transparent 1px 3px)`,
        `repeating-linear-gradient(90deg, ${ink} 0 1px, transparent 1px 4px)`,
      ].join(", ");
    default:
      return undefined;
  }
}

export default function ProductArt({
  product,
  colorHex,
  className = "",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority = false,
}: {
  product: Product;
  colorHex?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (product.image) {
    return (
      <div className={`relative aspect-[3/4] overflow-hidden bg-cream-dark ${className}`}>
        <Image src={product.image} alt={product.name} fill sizes={sizes} priority={priority} className="object-cover" />
      </div>
    );
  }

  const hex = colorHex ?? product.colors[0].hex;
  const light = isLight(hex);
  const ink = light ? "rgba(42,18,16,0.07)" : "rgba(255,245,236,0.08)";
  const fg = light ? "text-ink/70" : "text-cream/80";

  return (
    <div
      role="img"
      aria-label={`${product.name}, illustration`}
      className={`relative flex aspect-[3/4] flex-col items-center justify-center overflow-hidden ${className}`}
      style={{
        backgroundColor: hex,
        backgroundImage: texture(product.pattern, ink),
        backgroundSize: product.pattern === "brocade" ? "22px 22px" : undefined,
      }}
    >
      {/* Soft vignette for depth, like studio lighting on cloth. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 35%, rgba(255,255,255,0.14), transparent 60%), linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.12))" }}
      />
      <div aria-hidden="true" className={`relative flex flex-col items-center gap-3 ${fg}`}>
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-current/40 font-serif text-lg tracking-wider">
          J&amp;H
        </span>
        <span className="text-[10px] font-medium uppercase tracking-[0.35em]">{product.type}</span>
      </div>
    </div>
  );
}

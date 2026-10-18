import type { Product } from "@/lib/catalog";
import BuyProductButton from "./BuyProductButton";

const KIND_LABEL: Record<Product["kind"], string> = {
  dvd: "DVD",
  music: "Music",
  poster: "Poster",
  apparel: "Apparel",
  other: "Merch",
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col border border-line">
      <div className="relative aspect-square bg-void">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="display flex h-full items-center justify-center text-6xl text-haze">{KIND_LABEL[product.kind]}</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <p className="eyebrow text-haze">{KIND_LABEL[product.kind]}{product.physical ? " · Ships" : " · Digital"}</p>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        {product.by && <p className="text-sm text-chalk">{product.by}</p>}
        {product.description && <p className="text-sm text-haze">{product.description}</p>}
        <div className="mt-auto pt-3">
          <BuyProductButton productId={product.id} priceCents={product.priceCents} />
        </div>
      </div>
    </article>
  );
}

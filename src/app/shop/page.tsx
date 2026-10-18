import type { Metadata } from "next";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import ProductCard from "@/components/site/ProductCard";
import { PRODUCTS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description: "Trust None DVDs, music and merch from the film and its Chicago artists.",
};

export default function ShopPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <h1 className="display text-8xl">Shop</h1>
        <p className="mt-2 max-w-prose text-haze">DVDs, music and merch from the film and its Chicago artists. Physical items ship to the US and Canada.</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

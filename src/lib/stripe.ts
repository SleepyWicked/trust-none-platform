import Stripe from "stripe";
import { coinPackages, tiers, FULL_SEASON_PRICE } from "./tiers";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

// Map our product types to Stripe checkout line items
export function getCheckoutLineItem(
  type: "coins" | "season" | "tier" | "founding",
  id?: string,
  amount?: number
): { name: string; amount: number; description: string } {
  switch (type) {
    case "coins": {
      const pkg = coinPackages.find((p) => p.id === id);
      if (!pkg) throw new Error(`Invalid coin package: ${id}`);
      return {
        name: `${pkg.coins} Coins`,
        amount: Math.round(pkg.price * 100), // cents
        description: `${pkg.coins} coins for Trust None (${pkg.savings})`,
      };
    }
    case "season":
      return {
        name: "Full Season Unlock",
        amount: Math.round(FULL_SEASON_PRICE * 100),
        description: "Unlock all 10 episodes of Trust None Season 1",
      };
    case "tier": {
      const tier = tiers.find((t) => t.id === Number(id));
      if (!tier) throw new Error(`Invalid tier: ${id}`);
      return {
        name: tier.name,
        amount: Math.round(tier.price * 100),
        description: tier.description,
      };
    }
    case "founding":
      return {
        name: "Founding Supporter",
        amount: Math.round((amount || 5) * 100),
        description: "Founding Supporter — Trust None",
      };
    default:
      throw new Error(`Unknown purchase type: ${type}`);
  }
}

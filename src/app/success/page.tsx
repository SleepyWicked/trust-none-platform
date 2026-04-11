"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { coinPackages, tiers, CREW_FUND_PERCENTAGE } from "@/lib/tiers";

function SuccessContent() {
  const searchParams = useSearchParams();
  const {
    addCoins,
    unlockAllEpisodes,
    purchaseTier,
    addToCrewFund,
    addTransaction,
    addFoundingSupporter,
  } = useAppStore();
  const [processed, setProcessed] = useState(false);
  const [details, setDetails] = useState<{ name: string; amount: string }>({
    name: "",
    amount: "",
  });

  useEffect(() => {
    if (processed) return;

    const type = searchParams.get("type");
    const id = searchParams.get("id");
    const customAmount = searchParams.get("amount");

    if (!type) return;

    setProcessed(true);

    switch (type) {
      case "coins": {
        const pkg = coinPackages.find((p) => p.id === id);
        if (pkg) {
          addCoins(pkg.coins);
          addToCrewFund(pkg.price * CREW_FUND_PERCENTAGE);
          addTransaction({
            type: "coin_purchase",
            amount: pkg.price,
            description: `Purchased ${pkg.coins} coins`,
          });
          setDetails({ name: `${pkg.coins} Coins`, amount: `$${pkg.price}` });
        }
        break;
      }
      case "season": {
        unlockAllEpisodes();
        addToCrewFund(24.99 * CREW_FUND_PERCENTAGE);
        addTransaction({
          type: "tier_purchase",
          amount: 24.99,
          description: "Full Season 1 Unlock",
        });
        setDetails({ name: "Full Season Unlock", amount: "$24.99" });
        break;
      }
      case "tier": {
        const tier = tiers.find((t) => t.id === Number(id));
        if (tier) {
          purchaseTier(tier.id);
          unlockAllEpisodes();
          addToCrewFund(tier.price * CREW_FUND_PERCENTAGE);
          addTransaction({
            type: "tier_purchase",
            amount: tier.price,
            description: `Purchased: ${tier.name}`,
          });
          setDetails({ name: tier.name, amount: `$${tier.price}` });
        }
        break;
      }
      case "founding": {
        const amt = Number(customAmount) || 5;
        addFoundingSupporter();
        addToCrewFund(amt * CREW_FUND_PERCENTAGE);
        addTransaction({
          type: "founding_supporter",
          amount: amt,
          description: "Founding Supporter contribution",
        });
        setDetails({ name: "Founding Supporter", amount: `$${amt}` });
        break;
      }
    }
  }, [
    searchParams,
    processed,
    addCoins,
    unlockAllEpisodes,
    purchaseTier,
    addToCrewFund,
    addTransaction,
    addFoundingSupporter,
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0a0a0a" }}>
      <div className="max-w-sm w-full text-center">
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-white mb-2">Payment Confirmed</h1>

        {details.name && (
          <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-lg font-bold text-gold">{details.name}</p>
            <p className="text-sm text-gray-400">{details.amount}</p>
          </div>
        )}

        <p className="text-sm text-gray-400 mt-4 mb-6">
          Thank you for supporting Trust None. Your purchase has been applied.
        </p>

        <a
          href="/"
          className="inline-block px-8 py-3 bg-gold text-black font-bold rounded-lg hover:bg-gold-light transition-all"
        >
          Back to Trust None
        </a>

        <p className="text-xs text-gray-600 mt-4">
          15% of your purchase went to the crew fund
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
          <p className="text-gray-400">Processing...</p>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}

"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("@/components/App"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="text-center">
        <h1 className="text-4xl font-black text-shimmer">TRUST NONE</h1>
        <p className="text-sm mt-2" style={{ color: "#6a6a6a" }}>Loading...</p>
      </div>
    </div>
  ),
});

export default function ClientApp() {
  return <App />;
}

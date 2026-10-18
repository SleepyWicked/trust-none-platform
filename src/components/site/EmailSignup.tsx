"use client";

import { useId, useState } from "react";

export default function EmailSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const id = useId();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    }).catch(() => null);
    if (res?.ok) return setState("done");
    setError((await res?.json().catch(() => null))?.error ?? "Couldn't sign you up — try again");
    setState("error");
  };

  if (state === "done") {
    return <p role="status" className="mt-5 border border-line p-4 text-chalk">You&apos;re on the list.</p>;
  }

  return (
    <form onSubmit={submit} className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
      <label htmlFor={id} className="sm:flex-1">
        <span className="eyebrow mb-1.5 block">Email</span>
        <input
          id={id}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full min-h-12 border border-line bg-transparent px-3.5 placeholder:text-haze focus:border-paper focus:outline-none"
        />
      </label>
      <button type="submit" disabled={state === "sending"} className="btn btn-solid">
        {state === "sending" ? "Sending…" : "Notify Me"}
      </button>
      {state === "error" && <p role="alert" className="text-sm text-red-300 sm:basis-full">{error}</p>}
    </form>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.replace("/admin/dashboard");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Login failed");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-5">
      <form onSubmit={onSubmit} className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-widest2 text-gold">
          Genet Ethiopian Market
        </p>
        <h1 className="mt-3 font-serif text-3xl text-forest">Admin Access</h1>
        <div className="gold-rule mt-5" />
        <label className="mt-8 block text-xs uppercase tracking-widest2 text-ink/60">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
            className="mt-2 w-full border border-forest/20 bg-white px-4 py-3 text-base text-ink outline-none focus:border-gold"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className="btn-dark mt-6 w-full disabled:opacity-50">
          {busy ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}

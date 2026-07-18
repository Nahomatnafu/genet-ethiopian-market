"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignOutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function signOut() {
    setBusy(true);
    await fetch("/api/auth/login", { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={busy}
      className="text-xs uppercase tracking-widest2 text-ink/50 underline underline-offset-4 hover:text-ink disabled:opacity-50"
    >
      {busy ? "Signing Out…" : "Sign Out"}
    </button>
  );
}

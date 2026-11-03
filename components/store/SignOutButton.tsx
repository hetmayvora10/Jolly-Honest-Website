"use client";

import { useState } from "react";
import { secondaryButton } from "./ui";

export default function SignOutButton({ redirectTo = "/shop" }: { redirectTo?: string }) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
        window.location.assign(redirectTo);
      }}
      className={secondaryButton}
    >
      {busy ? "Signing out…" : "Sign Out"}
    </button>
  );
}

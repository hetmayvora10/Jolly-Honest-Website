"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { getClientAuth } from "@/lib/firebase/client";
import { errorBox, fieldInput, fieldLabel, primaryButton, secondaryButton } from "./ui";

type Mode = "signin" | "signup" | "reset";

export const MIN_PASSWORD_LENGTH = 10;

// Deliberately vague where it matters: never confirm whether an email has an
// account, so the forms can't be used to check who shops here.
function messageFor(err: unknown, mode: Mode): string {
  const code = err instanceof FirebaseError ? err.code : "";
  if (code === "auth/too-many-requests") return "Too many attempts. Please wait a few minutes and try again.";
  if (code === "auth/network-request-failed") return "Network error. Please check your connection.";
  if (mode === "signup") {
    if (code === "auth/weak-password") return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (code === "auth/invalid-email") return "Enter a valid email address.";
    return "We couldn't create an account with that email. If you already have one, sign in or reset your password.";
  }
  return "Invalid email or password.";
}

async function startSession(user: User): Promise<void> {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken: await user.getIdToken() }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error ?? "Could not sign you in. Please try again.");
  }
}

export default function AuthForm({ mode, next }: { mode: Mode; next: string }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [unverified, setUnverified] = useState<User | null>(null);
  const [resent, setResent] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const auth = getClientAuth();

    if (mode === "signup") {
      if (password.length < MIN_PASSWORD_LENGTH) {
        setError(`Use at least ${MIN_PASSWORD_LENGTH} characters for your password.`);
        return;
      }
      if (password !== form.get("confirm")) {
        setError("The passwords don't match.");
        return;
      }
      if (password.toLowerCase().includes(email.split("@")[0].toLowerCase())) {
        setError("Your password shouldn't contain your email address.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "reset") {
        await sendPasswordResetEmail(auth, email).catch((err) => {
          // Same message whether or not the account exists.
          if (err instanceof FirebaseError && err.code === "auth/network-request-failed") throw err;
        });
        setResetSent(true);
        return;
      }

      let user: User;
      if (mode === "signup") {
        user = (await createUserWithEmailAndPassword(auth, email, password)).user;
        await updateProfile(user, { displayName: String(form.get("name") ?? "").trim() });
        await sendEmailVerification(user);
      } else {
        user = (await signInWithEmailAndPassword(auth, email, password)).user;
      }

      await startSession(user);

      if (mode === "signin" && !user.emailVerified) {
        // Keep the in-memory user just long enough to offer a resend.
        setUnverified(user);
        return;
      }
      await signOut(auth);
      window.location.assign(mode === "signup" ? "/account?welcome=1" : next);
    } catch (err) {
      setError(err instanceof Error && !(err instanceof FirebaseError) ? err.message : messageFor(err, mode));
    } finally {
      setLoading(false);
    }
  }

  if (resetSent) {
    return (
      <p role="status" className="bg-cream p-6 leading-relaxed text-ink">
        If an account exists for that email, a password reset link is on its way. Check your inbox
        and spam folder.
      </p>
    );
  }

  if (unverified) {
    return (
      <div role="status" className="bg-cream p-6">
        <p className="leading-relaxed text-ink">
          You&apos;re signed in, but your email isn&apos;t verified yet. You can browse and fill your
          bag; checkout unlocks once you click the link we emailed you and sign in again.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={resent}
            onClick={async () => {
              await sendEmailVerification(unverified).catch(() => {});
              setResent(true);
            }}
            className={secondaryButton}
          >
            {resent ? "Email sent" : "Resend verification email"}
          </button>
          <button
            type="button"
            onClick={async () => {
              await signOut(getClientAuth());
              window.location.assign(next);
            }}
            className={secondaryButton}
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5" noValidate={false}>
      {mode === "signup" && (
        <label className={fieldLabel}>
          Full name
          <input name="name" required minLength={2} maxLength={100} autoComplete="name" className={fieldInput} />
        </label>
      )}
      <label className={fieldLabel}>
        Email
        <input name="email" type="email" required autoComplete="email" className={fieldInput} />
      </label>
      {mode !== "reset" && (
        <label className={fieldLabel}>
          Password
          <input
            name="password"
            type="password"
            required
            minLength={mode === "signup" ? MIN_PASSWORD_LENGTH : undefined}
            maxLength={128}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            className={fieldInput}
          />
          {mode === "signup" && (
            <span className="normal-case tracking-normal text-ink/60">
              At least {MIN_PASSWORD_LENGTH} characters. A passphrase works well.
            </span>
          )}
        </label>
      )}
      {mode === "signup" && (
        <label className={fieldLabel}>
          Confirm password
          <input name="confirm" type="password" required maxLength={128} autoComplete="new-password" className={fieldInput} />
        </label>
      )}

      {error && <p role="alert" className={errorBox}>{error}</p>}

      <button type="submit" disabled={loading} className={`${primaryButton} mt-2`}>
        {loading
          ? "Please wait…"
          : mode === "signup"
            ? "Create Account"
            : mode === "reset"
              ? "Send Reset Link"
              : "Sign In"}
      </button>

      {mode === "signin" && (
        <Link href="/forgot-password" className="justify-self-center text-xs text-ink/70 underline underline-offset-4 hover:text-burgundy">
          Forgot your password?
        </Link>
      )}
    </form>
  );
}

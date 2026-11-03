import type { Metadata } from "next";
import Link from "next/link";
import AuthForm from "@/components/store/AuthForm";
import AuthShell from "@/components/store/AuthShell";

export const metadata: Metadata = { title: "Reset Password", robots: { index: false } };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account help"
      title="Reset Password"
      footer={
        <Link href="/signin" className="text-ink underline underline-offset-4 hover:text-burgundy">
          Back to sign in
        </Link>
      }
    >
      <p className="mb-6 text-center text-sm leading-relaxed text-ink/70">
        Enter the email you signed up with and we&apos;ll send you a link to choose a new password.
      </p>
      <AuthForm mode="reset" next="/account" />
    </AuthShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "@/components/store/AuthForm";
import AuthShell from "@/components/store/AuthShell";
import { getSession } from "@/lib/session";
import { safeNextPath } from "@/lib/http";

export const metadata: Metadata = { title: "Sign In", robots: { index: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function SignInPage({ searchParams }: Props) {
  const next = safeNextPath((await searchParams).next);
  // Unverified users may sign in again (that's how a newly verified email
  // reaches their session), so only fully verified sessions skip the form.
  if ((await getSession())?.emailVerified) redirect(next);

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Sign In"
      footer={
        <>
          New to Jolly &amp; Honest?{" "}
          <Link href={`/signup?next=${encodeURIComponent(next)}`} className="text-ink underline underline-offset-4 hover:text-burgundy">
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm mode="signin" next={next} />
    </AuthShell>
  );
}

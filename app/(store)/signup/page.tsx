import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AuthForm from "@/components/store/AuthForm";
import AuthShell from "@/components/store/AuthShell";
import { getSession } from "@/lib/session";
import { safeNextPath } from "@/lib/http";

export const metadata: Metadata = { title: "Create an Account", robots: { index: false } };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function SignUpPage({ searchParams }: Props) {
  const next = safeNextPath((await searchParams).next);
  if (await getSession()) redirect(next);

  return (
    <AuthShell
      eyebrow="Join us"
      title="Create Account"
      footer={
        <>
          Already have an account?{" "}
          <Link href={`/signin?next=${encodeURIComponent(next)}`} className="text-ink underline underline-offset-4 hover:text-burgundy">
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm mode="signup" next={next} />
    </AuthShell>
  );
}

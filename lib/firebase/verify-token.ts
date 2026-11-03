import { jwtVerify, createRemoteJWKSet } from "jose";

// firebase-admin/auth's verifyIdToken() pulls in jwks-rsa, which does a CJS
// require() of the ESM-only `jose` package — this crashes at runtime on
// Vercel regardless of bundler (Turbopack or webpack). Verifying the token
// ourselves with `jose`, imported directly as ESM from our own code, avoids
// that broken dependency chain entirely while doing the same RS256/JWKS check
// firebase-admin would have done.
const JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
  )
);

export type VerifiedIdToken = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  /** Seconds since epoch when the user last actually entered their password. */
  authTime: number;
};

export async function verifyFirebaseIdToken(idToken: string): Promise<VerifiedIdToken> {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID environment variable");
  }

  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    // Pin the algorithm so a token can never pick a weaker one for itself.
    algorithms: ["RS256"],
  });

  if (!payload.sub) {
    throw new Error("Invalid token: missing subject claim");
  }

  const email = typeof payload.email === "string" ? payload.email.toLowerCase() : null;
  return {
    uid: payload.sub,
    email,
    emailVerified: payload.email_verified === true,
    authTime: typeof payload.auth_time === "number" ? payload.auth_time : 0,
  };
}

// A valid Firebase token only proves someone has *an* account in this project.
// Anyone can create one with the public web API key unless sign-up is disabled
// in the console, so admin access also requires being on this allowlist.
// Fails closed: with ADMIN_EMAILS unset, nobody is an admin.
export function isAdminEmail(email: string | null): boolean {
  if (!email) return false;
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return allowlist.includes(email);
}

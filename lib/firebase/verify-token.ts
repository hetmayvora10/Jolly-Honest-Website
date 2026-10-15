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

export async function verifyFirebaseIdToken(idToken: string): Promise<{ uid: string }> {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (!projectId) {
    throw new Error("Missing FIREBASE_PROJECT_ID environment variable");
  }

  const { payload } = await jwtVerify(idToken, JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  if (!payload.sub) {
    throw new Error("Invalid token: missing subject claim");
  }

  return { uid: payload.sub };
}

import { NextResponse } from 'next/server';

export const runtime = 'edge'
// Function to generate a nonce (e.g., a timestamp or a random string)
function generateNonce() {
  return Date.now().toString(); // You can use a more sophisticated method if needed
}

// Function to generate HMAC signature using Web Crypto API
async function generateHMAC(nonce: string, secretKey: string, apiKey: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(nonce + apiKey)
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST() {
  try {
    // Secret key from environment variables
    const secretKey = process.env.SECRET_KEY;
    const apiKey = process.env.API_KEY;

    if (!secretKey) {
      throw new Error("SECRET_KEY must be set in the environment");
    }

    const nonce = generateNonce();
    const signature = await generateHMAC(nonce, secretKey, apiKey);

    return NextResponse.json({ nonce, signature, apiKey });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
import crypto from "crypto";

// Function to transform initData into an object
function parseQuery(initData: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(initData));
}

// Function to generate the check string
async function generateCheckString(
  data: Record<string, string>,
): Promise<string> {
  return Object.keys(data)
    .filter((key) => key !== "hash")
    .map((key) => `${key}=${data[key]}`)
    .sort()
    .join("\n");
}

// Function to compute the HMAC-SHA256 hash
async function computeHash(
  data: Record<string, string>,
  botToken: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const checkString = await generateCheckString(data);
  const secretKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode("WebAppData"),
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"],
  );
  const secret = await crypto.subtle.sign(
    "HMAC",
    secretKey,
    encoder.encode(botToken),
  );
  const signatureKey = await crypto.subtle.importKey(
    "raw",
    secret,
    { name: "HMAC", hash: "SHA-256" },
    true,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    signatureKey,
    encoder.encode(checkString),
  );

  const hex = [...new Uint8Array(signature)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hex;
}

// Function to verify Telegram data
export async function verifyTelegramData(
  rawQuery: string,
  botToken: string,
): Promise<boolean> {
  const data = parseQuery(rawQuery);
  const hash = data.hash || "";
  const computedHash = await computeHash(data, botToken);
  return computedHash === hash;
}

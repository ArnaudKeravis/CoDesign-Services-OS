export const ACCESS_COOKIE = "cds_access";

/** The cookie carries a derived token, never the access code itself. */
export async function accessToken(code: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`cds-access:v1:${code}`));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

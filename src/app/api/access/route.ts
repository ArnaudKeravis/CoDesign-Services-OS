import { NextResponse } from "next/server";

import { ACCESS_COOKIE, accessToken } from "@/lib/access";

export async function POST(request: Request) {
  const form = await request.formData();
  const code = String(form.get("code") ?? "");
  const next = String(form.get("next") ?? "/");
  const safe = next.startsWith("/") && !next.startsWith("//") ? next : "/";
  const expected = process.env.ACCESS_CODE;
  if (!expected || code !== expected) {
    return NextResponse.redirect(new URL(`/access?error=1&next=${encodeURIComponent(safe)}`, request.url), 303);
  }
  const response = NextResponse.redirect(new URL(safe, request.url), 303);
  response.cookies.set(ACCESS_COOKIE, await accessToken(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}

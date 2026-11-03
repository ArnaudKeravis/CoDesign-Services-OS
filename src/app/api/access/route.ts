import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const form = await request.formData();
  const code = String(form.get("code") ?? "");
  const next = String(form.get("next") ?? "/");
  const target = new URL(next.startsWith("/") && !next.startsWith("//") ? next : "/", request.url);
  if (!process.env.ACCESS_CODE || code !== process.env.ACCESS_CODE) {
    return NextResponse.redirect(new URL(`/access?error=1&next=${encodeURIComponent(next)}`, request.url), 303);
  }
  const response = NextResponse.redirect(target, 303);
  response.cookies.set("cds_access", code, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  return response;
}

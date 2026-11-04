import { NextResponse, type NextRequest } from "next/server";

import { ACCESS_COOKIE, accessToken } from "@/lib/access";

export async function middleware(request: NextRequest) {
  const code = process.env.ACCESS_CODE;
  if (!code) return NextResponse.next();
  const expected = await accessToken(code);
  if (request.cookies.get(ACCESS_COOKIE)?.value === expected) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Access code required" }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/access";
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!access|api/access|os-bridge.js|_next/static|_next/image|icon.svg|favicon.ico).*)"],
};

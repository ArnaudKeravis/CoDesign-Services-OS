import { NextResponse, type NextRequest } from "next/server";

const ACCESS_COOKIE = "cds_access";

export function middleware(request: NextRequest) {
  const code = process.env.ACCESS_CODE;
  if (!code) return NextResponse.next();
  if (request.cookies.get(ACCESS_COOKIE)?.value === code) return NextResponse.next();
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Access code required" }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/access";
  url.search = `?next=${encodeURIComponent(request.nextUrl.pathname)}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!access|api/access|_next/static|_next/image|icon.svg|favicon.ico).*)"],
};

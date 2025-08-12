import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // Simple check if Auth0 session cookie exists (replace with your cookie name)
  const authCookie = req.cookies.get("appSession");

  if (!authCookie) {
    return NextResponse.redirect(new URL("/api/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/care-worker/:path*", "/manager/:path*"], // Protect routes
};

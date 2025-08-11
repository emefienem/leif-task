import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getSession(req, res);
  if (!session) {
    return NextResponse.redirect(new URL("/api/auth/login", req.url));
  }
  const roles =
    (session.user["https://leif-task.vercel.app/roles"] as string[]) || [];
  if (
    req.nextUrl.pathname.startsWith("/manager") &&
    !roles.includes("MANAGER")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  if (
    req.nextUrl.pathname.startsWith("/care-worker") &&
    !roles.includes("CARE_WORKER")
  ) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }
  return res;
}

export const config = {
  matcher: ["/manager/:path*", "/care-worker/:path*"],
};

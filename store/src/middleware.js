import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const locales = ["en", "en-US", "es", "fr", "nl-NL"];
const defaultLocale = "en";
const protectedRoutes = ["/user", "/order", "/checkout"];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip internal and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  const pathnameParts = pathname.split("/");
  const currentLocale = locales.includes(pathnameParts[1])
    ? pathnameParts[1]
    : defaultLocale;

  // Build path without locale
  const pathAfterLocale = locales.includes(pathnameParts[1])
    ? `/${pathnameParts.slice(2).join("/")}`
    : pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathAfterLocale.startsWith(route)
  );

  // Skip auth check for login/register routes
  if (isProtected && !pathAfterLocale.startsWith("/auth")) {
    const userInfo = await getToken({ req: request });

    // console.log("userInfo:", userInfo);
    if (!userInfo) {
      return NextResponse.redirect(
        // new URL(`/${currentLocale}/auth/login`, request.url)
        new URL(`/auth/login`, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|images).*)"],
};

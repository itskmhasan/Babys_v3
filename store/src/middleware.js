import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

const locales = ["en", "en-US", "es", "fr", "nl-NL"];
const defaultLocale = "en";
const protectedRoutes = ["/user", "/order", "/checkout"];
const guestOnlyRoutes = ["/auth/login", "/auth/signup", "/login", "/register"];

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

  const isGuestOnly = guestOnlyRoutes.some(
    (route) => pathAfterLocale === route || pathAfterLocale.startsWith(`${route}/`)
  );

  const requestedRedirect = request.nextUrl.searchParams.get("redirectUrl");
  const safeRedirect = requestedRedirect
    ? requestedRedirect.startsWith("/")
      ? requestedRedirect
      : `/${requestedRedirect}`
    : null;

  const token = await getToken({ req: request });
  const legacyAuthCookie = request.cookies.get("_userInfo")?.value;
  const isAuthenticated = !!token || !!legacyAuthCookie;

  if (isGuestOnly && isAuthenticated) {
    return NextResponse.redirect(
      new URL(safeRedirect || `/user/dashboard`, request.url)
    );
  }

  // Skip auth check for login/register routes
  if (isProtected && !pathAfterLocale.startsWith("/auth")) {
    if (!isAuthenticated) {
      const loginUrl = new URL(`/auth/login`, request.url);
      loginUrl.searchParams.set("redirectUrl", pathAfterLocale);

      return NextResponse.redirect(
        // new URL(`/${currentLocale}/auth/login`, request.url)
        loginUrl
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|images).*)"],
};

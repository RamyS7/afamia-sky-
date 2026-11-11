import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["ar", "en"];
const defaultLocale = "ar";

// شكل كود لغة (fr, de, en-US...) — نستبدله باللغة الافتراضية بدل ما نحطه جوه المسار
const LOCALE_LIKE = /^[a-z]{2}(-[a-z]{2})?$/i;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const [, first = "", ...rest] = pathname.split("/");
  if (LOCALE_LIKE.test(first)) {
    // /fr أو /fr/... ← /ar أو /ar/... (بدل /ar/fr اللي بيطلع 404)
    request.nextUrl.pathname = `/${defaultLocale}${rest.length ? `/${rest.join("/")}` : ""}`;
  } else {
    request.nextUrl.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  }
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    /*
     * كل المسارات ما عدا:
     * - api
     * - _next/static و _next/image
     * - favicon.ico وأي ملف فيه امتداد (صور، svg...)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};

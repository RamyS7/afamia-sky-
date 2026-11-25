
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Noto_Sans_Arabic } from "next/font/google";
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang === "ar";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.afamiaplywood.com";
  const title = isAr
    ? "AFAMIA SKY PLYWOOD LLC | مصنع أبلكاش وأخشاب في الإسكندرية"
    : "AFAMIA SKY PLYWOOD LLC | Plywood, Timber & Veneer in Alexandria, Egypt";
  const description = isAr
    ? "مصنع أبلكاش في الإسكندرية، مصر. نورّد الألواح وأبلكاش البتولا والأخشاب الصلبة واللينة وقشرة الخشب وجذوع البتولا."
    : "Plywood factory in Alexandria, Egypt. We supply panels, birch plywood, hardwood, softwood, veneer and birch logs.";

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ar: "/ar",
        en: "/en",
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/${lang}`,
      siteName: "AFAMIA SKY PLYWOOD",
      locale: isAr ? "ar_EG" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const validLang = lang === "en" ? "en" : "ar";
  const dir = validLang === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={validLang}
      dir={dir}
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${notoSansArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* ده الـ root layout فبيتحمّل على كل الصفحات، فتحذير no-page-custom-font (الخاص بـ pages router) مش منطبق.
            display=block: أسماء الأيقونات (menu, close...) متظهرش كنص لحد ما الخط يتحمّل */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display -- خط أيقونات: block هو الصح هنا */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen">
        {children}
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Noto_Serif, Plus_Jakarta_Sans, Noto_Sans_Arabic } from "next/font/google";
import "../globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isAr = lang === "ar";

  return {
    title: isAr
      ? "أفاميا لتجارة وتصنيع الأخشاب والأبلكاش | Afamia Timber & Plywood"
      : "Afamia Timber & Plywood | Quality Wood & Plywood Supply",
    description: isAr
      ? "متخصصون في تصنيع الأبلكاش وتوريد الأخشاب والجزوع عالية الجودة لتلبية متطلبات المقاولات، المصانع، وكبرى المشاريع الإنشائية والتجارية."
      : "Specialized in plywood manufacturing and supplying high-quality timber and raw logs for contracting companies, manufacturing plants, and commercial construction projects.",
    icons: {
      icon: "/logo.png",
      apple: "/logo.png",
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
      className={`${notoSerif.variable} ${plusJakartaSans.variable} ${notoSansArabic.variable}`}
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

"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Dictionary } from "../[lang]/dictionaries";

interface HeaderProps {
  currentLang: "ar" | "en";
  t: Dictionary["nav"];
  onOpenQuote: () => void;
}

// خارج المكوّن عشان قاعدة purity ما تعتبرها استدعاء أثناء الريندر (بنستخدمها جوه event handler بس)
const now = () => performance.now();

const SECTION_IDS = ["about-us", "products-showcase", "supply", "contact-inquiry"] as const;

export default function Header({ currentLang, t, onOpenQuote }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("top");
  // بنسجل اللغة اللي بدأنا منها؛ أول ما currentLang يتغير الحالة تتلغى تلقائيًا من غير useEffect
  const [switching, setSwitching] = useState<{ from: "ar" | "en"; to: "ar" | "en" } | null>(null);
  const switchingTo = switching && switching.from === currentLang ? switching.to : null;
  const savedScrollRef = useRef(0);
  const guardRafRef = useRef(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => () => cancelAnimationFrame(guardRafRef.current), []);

  // ظل خفيف بعد النزول + تمييز القسم الحالي في القائمة
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const visible = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        }
        const top = SECTION_IDS.find((id) => visible.has(id));
        setActiveId(top ?? (window.scrollY < 200 ? "top" : ""));
      },
      { rootMargin: "-90px 0px -55% 0px", threshold: [0, 0.1] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  const switchLanguage = (targetLang: "ar" | "en") => {
    if (targetLang === currentLang || switchingTo) return;
    setSwitching({ from: currentLang, to: targetLang });
    const newPath = pathname ? pathname.replace(`/${currentLang}`, `/${targetLang}`) : `/${targetLang}`;
    // تبديل اللغة يقلب اتجاه الصفحة ويعيد بناءها، فيُصفَّر التمرير حتى مع scroll:false —
    // نحفظ الموضع ونعيده خلال نافذة قصيرة حتى يستقر التخطيط الجديد، ونترك المستخدم يلغيها بلمسه
    const savedY = window.scrollY;
    if (savedY > 0) {
      savedScrollRef.current = savedY;
      const cancelGuard = () => {
        savedScrollRef.current = 0;
        cancelAnimationFrame(guardRafRef.current);
        window.removeEventListener("wheel", cancelGuard);
        window.removeEventListener("touchstart", cancelGuard);
      };
      window.addEventListener("wheel", cancelGuard, { once: true, passive: true });
      window.addEventListener("touchstart", cancelGuard, { once: true, passive: true });
      const start = now();
      const guard = () => {
        if (savedScrollRef.current === 0) {
          window.removeEventListener("wheel", cancelGuard);
          window.removeEventListener("touchstart", cancelGuard);
          return;
        }
        if (Math.abs(window.scrollY - savedScrollRef.current) > 1) {
          // instant: غير كده scroll-behavior:smooth يخلّي الاستعادة تتحرك من فوق
          window.scrollTo({ top: savedScrollRef.current, behavior: "instant" });
        }
        if (now() - start < 1200) {
          guardRafRef.current = requestAnimationFrame(guard);
        } else {
          cancelGuard();
        }
      };
      guardRafRef.current = requestAnimationFrame(guard);
    }
    router.push(newPath, { scroll: false });
  };

  const links: { id: string; href: string; label: string }[] = [
    { id: "top", href: "#top", label: t.home },
    { id: "about-us", href: "#about-us", label: t.about },
    { id: "products-showcase", href: "#products-showcase", label: t.products },
    { id: "supply", href: "#supply", label: t.supply },
    { id: "contact-inquiry", href: "#contact-inquiry", label: t.contact },
  ];

  const goTo = (e: React.MouseEvent, id: string) => {
    setMobileMenuOpen(false);
    if (id === "top") {
      // preventDefault حتى يعمل التمرير لأعلى في كل ضغطة
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const quoteBtn =
    "inline-flex items-center justify-center gap-2 bg-accent hover:bg-primary text-on-primary-container hover:text-on-primary h-11 px-5 rounded-full font-label-md text-label-md font-bold whitespace-nowrap transition-colors cursor-pointer shadow-sm hover:shadow-md";

  const langBtn = (lang: "ar" | "en", text: string, label: string) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={currentLang === lang}
      aria-busy={switchingTo === lang}
      onClick={() => switchLanguage(lang)}
      className={`relative z-10 w-11 py-1 text-center font-label-md text-label-md font-semibold transition-colors duration-300 cursor-pointer ${
        currentLang === lang ? "text-on-primary" : "text-on-surface-variant hover:text-on-surface"
      }`}
    >
      {switchingTo === lang ? (
        <span className="material-symbols-outlined inline-block text-base animate-spin align-middle">
          progress_activity
        </span>
      ) : (
        text
      )}
    </button>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 w-full z-50 bg-surface/95 backdrop-blur-xl border-b transition-shadow duration-300 ${
        scrolled ? "border-outline-variant shadow-[0_2px_14px_rgba(36,37,31,0.08)]" : "border-transparent"
      }`}
    >
      <div className="h-20 max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop flex items-center gap-gutter-md">
        {/* الشعار + اسم الشركة */}
        <div className="flex-1 flex items-center">
          <Link
            className="flex items-center gap-3 group"
            href={`/${currentLang}`}
            aria-label={`${t.brandName} ${t.brandSub}`}
            onClick={(e) => {
              // إحنا أصلاً على الصفحة الرئيسية: نطلع لفوق بدل reload كامل
              e.preventDefault();
              setMobileMenuOpen(false);
              if (window.location.hash) history.replaceState(null, "", `/${currentLang}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Image
              src="/logo.png"
              alt=""
              width={120}
              height={90}
              className="h-14 sm:h-[60px] w-auto object-contain transition-transform group-hover:scale-105 duration-300"
              priority
            />
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="font-headline-md font-extrabold text-[17px] tracking-wide text-on-surface" dir="ltr">
                {t.brandName}
              </span>
              <span className="text-[12px] tracking-[0.18em] uppercase text-primary font-semibold" dir="ltr">
                {t.brandSub}
              </span>
            </span>
          </Link>
        </div>

        {/* الروابط */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
          {links.map((l) => {
            const active = activeId === l.id;
            return (
              <a
                key={l.id}
                href={l.href}
                aria-current={active ? "true" : undefined}
                onClick={(e) => goTo(e, l.id)}
                className={`relative px-3.5 py-2 font-label-md text-label-md font-semibold rounded-full transition-colors ${
                  active
                    ? "text-primary bg-surface-container-low"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low/70"
                }`}
              >
                {l.label}
              </a>
            );
          })}
        </nav>

        {/* اللغة + طلب عرض سعر */}
        <div className="flex-1 flex items-center justify-end gap-2.5 sm:gap-3">
          <div
            role="group"
            aria-label="Language switcher"
            className={`relative flex items-center rounded-full bg-surface-container-low border border-outline-variant p-1 ${
              switchingTo ? "pointer-events-none" : ""
            }`}
          >
            {/* المؤشر المتحرك: حالة en فقط هي اللي بتزحزحه، وهي دايمًا LTR فالـ transform آمن */}
            <span
              aria-hidden="true"
              className={`absolute inset-y-1 start-1 w-11 rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out ${
                currentLang === "en" ? "translate-x-full" : "translate-x-0"
              }`}
            />
            {langBtn("ar", "عربي", "التبديل إلى العربية")}
            {langBtn("en", "EN", "Switch to English")}
          </div>

          <button type="button" onClick={onOpenQuote} className={`${quoteBtn} max-sm:hidden`}>
            <span className="material-symbols-outlined text-[18px]">request_quote</span>
            {t.quote}
          </button>

          <button
            type="button"
            className="lg:hidden p-2 text-on-surface hover:text-primary transition-colors rounded-full"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className="material-symbols-outlined text-[26px]">{mobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {/* قائمة الموبايل */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface border-t border-outline-variant px-margin-mobile py-3 shadow-lg">
          {links.map((l) => (
            <a
              key={l.id}
              href={l.href}
              onClick={(e) => goTo(e, l.id)}
              className={`block py-3 border-b border-outline-variant/50 font-label-md text-label-md font-semibold ${
                activeId === l.id ? "text-primary" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenQuote();
            }}
            className={`${quoteBtn} w-full mt-4 mb-2`}
          >
            <span className="material-symbols-outlined text-[18px]">request_quote</span>
            {t.quote}
          </button>
        </div>
      )}
    </header>
  );
}

"use client";

import React, { useState } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";
import ProductsSection from "./ProductsSection";
import WhyChooseSection from "./WhyChooseSection";
import ServicesSection from "./ServicesSection";
import CTAStrip from "./CTAStrip";
import ContactSection from "./ContactSection";
import Footer from "./Footer";
import QuickQuoteModal from "./QuickQuoteModal";
import FloatingWhatsApp from "./FloatingWhatsApp";
import { Dictionary } from "../[lang]/dictionaries";

interface HomeContentProps {
  lang: "ar" | "en";
  t: Dictionary;
}

// القاموس بيوصل جاهز من السيرفر، فالصفحة بتترندر بمحتواها الكامل في الـ HTML (مهم للـ SEO)
export default function HomeContent({ lang, t }: HomeContentProps) {
  const [quote, setQuote] = useState<{ id: number; product: string; message: string } | null>(null);

  const handleOpenQuote = (product = "", message = "") => {
    // id جديد مع كل فتح = المودال يتبني من الأول بالمنتج المختار وفورم فاضي
    setQuote({ id: Date.now(), product, message });
  };

  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Fixed Header */}
      <Header currentLang={lang} t={t.nav} onOpenQuote={() => handleOpenQuote()} />

      {/* Main Container */}
      <main className="w-full pt-20 bg-surface min-h-[calc(100vh-80px)]">
        <div className="flex flex-col w-full" id="root-portal">
          <HeroSection t={t.hero} />
          <AboutSection t={t.about} />
          <ProductsSection t={t.products} onOpenQuoteModal={handleOpenQuote} />
          <ServicesSection t={t.supply} />
          <WhyChooseSection t={t.enquiry} />
          <CTAStrip t={t.cta} onOpenQuoteModal={() => handleOpenQuote()} />
          <ContactSection t={t.contact} lang={lang} />
        </div>
      </main>

      <Footer t={t.footer} contact={t.contact} />

      <FloatingWhatsApp t={t.floatingContact} onOpenQuoteModal={() => handleOpenQuote()} />

      {quote && (
        <QuickQuoteModal
          key={quote.id}
          isOpen
          onClose={() => setQuote(null)}
          t={t.quickQuoteModal}
          contactFormT={t.contact.form}
          lang={lang}
          initialProduct={quote.product}
          initialMessage={quote.message}
        />
      )}
    </div>
  );
}

import React from "react";
import Image from "next/image";
import { Dictionary } from "../[lang]/dictionaries";

interface HeroSectionProps {
  t: Dictionary["hero"];
}

export default function HeroSection({ t }: HeroSectionProps) {
  return (
    <section className="w-full bg-surface" id="top">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop py-gutter-xl lg:py-gutter-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-center">
          {/* النص */}
          <div className="lg:col-span-6 flex flex-col items-start text-start order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-0.5 bg-accent" />
              <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold">
                {t.badge}
              </span>
            </div>

            <h1 className="font-headline-lg-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl text-on-surface mb-6">
              {t.titleLine1}
              <br />
              {t.titleLine2}
            </h1>

            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-6 leading-relaxed">
              {t.description}
            </p>

            <p className="flex items-center gap-2 font-spec-code text-spec-code uppercase tracking-widest text-secondary mb-10">
              <span className="material-symbols-outlined text-[18px] text-accent">location_on</span>
              {t.location}
            </p>

            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <a
                className="h-12 px-8 bg-inverse-surface hover:bg-primary text-surface-bright font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-full"
                href="#products-showcase"
              >
                <span>{t.productsButton}</span>
                <span className="material-symbols-outlined text-[18px] rtl:rotate-180">arrow_forward</span>
              </a>
              <a
                className="h-12 px-8 border border-on-surface/30 hover:border-on-surface hover:bg-surface-container-low text-on-surface font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-full"
                href="#contact-inquiry"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>{t.contactButton}</span>
              </a>
            </div>
          </div>

          {/* كولاج صور المنتجات */}
          <div className="lg:col-span-6 order-1 lg:order-2">
            <div className="relative w-full max-w-[560px] mx-auto lg:mx-0 lg:ms-auto aspect-[4/3] sm:aspect-[6/5] lg:aspect-[1161/1354] overflow-hidden bg-surface-container shadow-xl">
              <Image
                src="/images/hero-collage.webp"
                alt={t.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

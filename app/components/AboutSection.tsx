import React from "react";
import Image from "next/image";
import { Dictionary } from "../[lang]/dictionaries";

interface AboutSectionProps {
  t: Dictionary["about"];
}

export default function AboutSection({ t }: AboutSectionProps) {
  const stats = [
    { value: t.stats.s1Value, label: t.stats.s1Label },
    { value: t.stats.s2Value, label: t.stats.s2Label },
    { value: t.stats.s3Value, label: t.stats.s3Label },
  ];

  return (
    <section className="w-full bg-surface-container-low py-gutter-3xl" id="about-us">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl lg:gap-gutter-2xl items-center">
          {/* الصورة */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/3] lg:aspect-[4/5] overflow-hidden bg-surface-container shadow-xl">
              <Image
                fill
                alt={t.imageAlt}
                src="/images/birch-plywood.webp"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* النص */}
          <div className="lg:col-span-7 flex flex-col items-start text-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-0.5 bg-accent" />
              <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold">
                {t.tag}
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-6">
              {t.title}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-4 leading-relaxed">{t.p1}</p>
            <p className="font-body-md text-body-md text-secondary mb-10 leading-relaxed">{t.p2}</p>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              {stats.map((s) => (
                <div key={s.label} className="border-t-2 border-accent pt-4">
                  <dt className="font-headline-md text-headline-md text-on-surface">{s.value}</dt>
                  <dd className="font-body-sm text-body-sm text-on-surface-variant mt-1">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

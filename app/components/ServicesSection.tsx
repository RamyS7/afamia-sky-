import React from "react";
import Image from "next/image";
import { Dictionary } from "../[lang]/dictionaries";

interface ServicesSectionProps {
  t: Dictionary["supply"];
}

// قسم "Ready to supply / Our supply range" من ملف العرض
const ITEMS = [
  { key: "plywood", image: "/images/birch-plywood.webp" },
  { key: "veneer", image: "/images/veneer.webp" },
  { key: "timber", image: "/images/softwood.webp" },
  { key: "logs", image: "/images/birch-logs.webp" },
] as const;

export default function ServicesSection({ t }: ServicesSectionProps) {
  return (
    <section className="w-full bg-surface-container-low py-gutter-3xl" id="supply">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="max-w-2xl mb-gutter-2xl text-start">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-0.5 bg-accent" />
            <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold">
              {t.tag}
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {t.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ITEMS.map((item, i) => (
            <div key={item.key} className="bg-surface-container-lowest shadow-sm text-start">
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-container">
                <Image
                  fill
                  alt={t.items[item.key]}
                  src={item.image}
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex items-start gap-4">
                <span className="font-headline-md text-headline-md text-accent leading-none" dir="ltr">
                  0{i + 1}
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">{t.items[item.key]}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

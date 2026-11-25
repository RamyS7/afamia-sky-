import React from "react";
import Image from "next/image";
import { Dictionary } from "../[lang]/dictionaries";

interface ProductsSectionProps {
  t: Dictionary["products"];
  onOpenQuoteModal?: (product: string, message: string) => void;
}

// id المنتج (بيتبعت للفورم) ← مفتاح القاموس + الصورة
const PRODUCTS = [
  { id: "panels", key: "panels", image: "/images/panels.webp" },
  { id: "birch-plywood", key: "birchPlywood", image: "/images/birch-plywood.webp" },
  { id: "hardwood", key: "hardwood", image: "/images/hardwood.webp" },
  { id: "softwood", key: "softwood", image: "/images/softwood.webp" },
  { id: "veneer", key: "veneer", image: "/images/veneer.webp" },
  { id: "birch-veneer", key: "birchVeneer", image: "/images/birch-veneer.webp" },
] as const;

export default function ProductsSection({ t, onOpenQuoteModal }: ProductsSectionProps) {
  const handleProductQuote = (e: React.MouseEvent, productId: string) => {
    if (onOpenQuoteModal) {
      e.preventDefault();
      onOpenQuoteModal(productId, "");
    }
  };

  return (
    <section className="w-full bg-surface py-gutter-3xl" id="products-showcase">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-gutter-2xl">
          <div className="text-start">
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
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md text-start">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRODUCTS.map((p) => {
            const item = t.items[p.key];
            return (
              <article
                key={p.id}
                className="group bg-surface-container-lowest flex flex-col shadow-sm hover:shadow-xl transition-shadow duration-300 text-start"
              >
                <div className="relative aspect-square overflow-hidden bg-surface-container">
                  <Image
                    fill
                    alt={item.title}
                    src={p.image}
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-headline-md text-headline-md text-on-surface mb-2">{item.title}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-5 leading-relaxed">
                    {item.description}
                  </p>

                  <span className="font-spec-code text-spec-code uppercase tracking-widest text-primary font-bold mb-2">
                    {t.appsLabel}
                  </span>
                  <ul className="space-y-1.5 mb-5 font-body-sm text-body-sm text-on-surface">
                    {[item.app1, item.app2].map((app) => (
                      <li key={app} className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-[16px] text-accent mt-0.5 shrink-0">
                          check
                        </span>
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="font-body-sm text-body-sm text-secondary mb-6 pt-4 border-t border-outline-variant">
                    {item.note}
                  </p>

                  <a
                    className="mt-auto h-11 bg-surface-container hover:bg-inverse-surface hover:text-surface-bright text-on-surface font-label-md text-label-md uppercase tracking-wider flex items-center justify-center transition-colors cursor-pointer rounded-full"
                    href="#contact-inquiry"
                    onClick={(e) => handleProductQuote(e, p.id)}
                  >
                    {t.cta}
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

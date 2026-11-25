import React from "react";
import { Dictionary } from "../[lang]/dictionaries";

interface WhyChooseSectionProps {
  t: Dictionary["enquiry"];
}

// قسم "Your product enquiry" من ملف العرض: إيه اللي نكتبه لما نطلب منتج
export default function WhyChooseSection({ t }: WhyChooseSectionProps) {
  const items = [t.items.i1, t.items.i2, t.items.i3, t.items.i4];

  return (
    <section className="w-full bg-surface py-gutter-3xl" id="enquiry">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-xl items-start">
          <div className="lg:col-span-5 text-start">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-0.5 bg-accent" />
              <span className="font-label-md text-label-md uppercase tracking-widest text-primary font-bold">
                {t.tag}
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-6">
              {t.title}
            </h2>
            <p className="font-body-md text-body-md text-secondary">{t.note}</p>
          </div>

          <ol className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((text, i) => (
              <li
                key={text}
                className="bg-surface-container-lowest p-6 shadow-sm flex items-start gap-4 text-start"
              >
                <span className="font-headline-md text-headline-md text-accent leading-none" dir="ltr">
                  0{i + 1}
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

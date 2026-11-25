import React from "react";
import { Dictionary } from "../[lang]/dictionaries";
import { CONTACT_PEOPLE } from "../lib/contact";

interface TopTickerProps {
  t: Dictionary["hero"];
}

// شريط رفيع تحت الهيدر: نوع النشاط والموقع + أرقام التواصل
export default function TopTicker({ t }: TopTickerProps) {
  return (
    <div className="w-full bg-inverse-surface text-inverse-on-surface py-2 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-6 font-spec-code text-spec-code">
        <span className="flex items-center gap-2 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
          {t.badge} · {t.location}
        </span>
        <span className="flex items-center gap-4">
          {CONTACT_PEOPLE.map((p) => (
            <a
              key={p.id}
              dir="ltr"
              href={`tel:${p.phoneE164}`}
              className="hover:text-primary-fixed-dim transition-colors"
            >
              {p.phoneDisplay}
            </a>
          ))}
        </span>
      </div>
    </div>
  );
}

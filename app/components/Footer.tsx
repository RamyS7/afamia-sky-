import React from "react";
import Image from "next/image";
import { Dictionary } from "../[lang]/dictionaries";
import {
  CONTACT_EMAIL,
  CONTACT_PEOPLE,
  FACEBOOK_URL,
  WEBSITE_DISPLAY,
  WEBSITE_URL,
} from "../lib/contact";

interface FooterProps {
  t: Dictionary["footer"];
  contact: Dictionary["contact"];
}

export default function Footer({ t, contact }: FooterProps) {
  const products = [t.p1, t.p2, t.p3, t.p4, t.p5, t.p6];
  const links = [
    { label: t.c1, href: "#about-us" },
    { label: t.c2, href: "#supply" },
    { label: t.c3, href: "#enquiry" },
    { label: t.c4, href: "#contact-inquiry" },
  ];

  return (
    <footer className="w-full bg-inverse-surface text-inverse-on-surface border-t border-accent/40 pt-gutter-3xl pb-gutter-xl">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-gutter-xl mb-gutter-2xl text-start">
          {/* العلامة */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Image
              src="/logo.png"
              alt="AFAMIA SKY PLYWOOD LLC"
              width={240}
              height={179}
              className="h-16 sm:h-20 w-auto object-contain mb-gutter-md"
            />
            <p className="font-body-sm text-body-sm text-surface-container-high max-w-sm mb-gutter-lg leading-relaxed">
              {t.description}
            </p>
            <div className="flex items-center gap-gutter-sm">
              <a
                aria-label="Facebook"
                className="w-10 h-10 bg-inverse-on-surface/10 hover:bg-accent text-inverse-on-surface hover:text-on-primary-container flex items-center justify-center transition-colors"
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
                </svg>
              </a>
              <a
                aria-label="Email"
                className="w-10 h-10 bg-inverse-on-surface/10 hover:bg-accent text-inverse-on-surface hover:text-on-primary-container flex items-center justify-center transition-colors"
                href={`mailto:${CONTACT_EMAIL}`}
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </a>
            </div>
          </div>

          {/* المنتجات */}
          <div className="lg:col-span-3 flex flex-col">
            <span className="font-spec-code text-spec-code uppercase tracking-widest text-primary-fixed-dim mb-gutter-md">
              {t.col1Title}
            </span>
            <ul className="space-y-3 font-body-sm text-body-sm text-surface-container-high">
              {products.map((name) => (
                <li key={name} className="hover:text-accent transition-colors">
                  <a href="#products-showcase">{name}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* الشركة */}
          <div className="lg:col-span-2 flex flex-col">
            <span className="font-spec-code text-spec-code uppercase tracking-widest text-primary-fixed-dim mb-gutter-md">
              {t.col2Title}
            </span>
            <ul className="space-y-3 font-body-sm text-body-sm text-surface-container-high">
              {links.map((l) => (
                <li key={l.href} className="hover:text-accent transition-colors">
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* التواصل */}
          <div className="lg:col-span-3 flex flex-col">
            <span className="font-spec-code text-spec-code uppercase tracking-widest text-primary-fixed-dim mb-gutter-md">
              {t.col3Title}
            </span>
            <div className="space-y-3 font-body-sm text-body-sm text-surface-container-high">
              <div className="flex items-start gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-accent shrink-0 mt-0.5">location_on</span>
                <span>{contact.info.locationDesc}</span>
              </div>
              {CONTACT_PEOPLE.map((p) => (
                <div key={p.id} className="flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] text-accent shrink-0 mt-0.5">call</span>
                  <span>
                    <a dir="ltr" href={`tel:${p.phoneE164}`} className="hover:text-accent transition-colors">
                      {p.phoneDisplay}
                    </a>
                    <span className="block text-outline-variant">
                      {p.name} · {contact.roles[p.id]}
                    </span>
                  </span>
                </div>
              ))}
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-accent shrink-0">mail</span>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-accent transition-colors [overflow-wrap:anywhere]">
                  {CONTACT_EMAIL}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-accent shrink-0">language</span>
                <a dir="ltr" href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">
                  {WEBSITE_DISPLAY}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-gutter-lg border-t border-inverse-on-surface/15 font-spec-code text-spec-code text-outline-variant text-center sm:text-start">
          {t.copyright}
        </div>
      </div>
    </footer>
  );
}

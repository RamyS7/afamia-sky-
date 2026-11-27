
"use client";

import React, { useState } from "react";
import { Dictionary } from "../[lang]/dictionaries";
import {
  CONTACT_EMAIL,
  CONTACT_PEOPLE,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
  WEBSITE_DISPLAY,
  WEBSITE_URL,
  inquiryWhatsAppUrl,
} from "../lib/contact";
import { submitInquiry } from "../lib/submitInquiry";

interface ContactSectionProps {
  t: Dictionary["contact"];
  lang: "ar" | "en";
}

const EMPTY_FORM = {
  name: "",
  company: "",
  phone: "",
  email: "",
  product: "",
  message: "",
  website: "",
};

export default function ContactSection({ t, lang }: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const productLabels: Record<string, string> = {
    panels: t.form.optPanels,
    "birch-plywood": t.form.optBirchPlywood,
    hardwood: t.form.optHardwood,
    softwood: t.form.optSoftwood,
    veneer: t.form.optVeneer,
    "birch-veneer": t.form.optBirchVeneer,
    "birch-logs": t.form.optBirchLogs,
    "custom-solution": t.form.optCustom,
  };

  const openWhatsApp = () => {
    const url = inquiryWhatsAppUrl(
      { ...formData, productLabel: productLabels[formData.product] ?? "" },
      lang
    );
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setHasError(false);
    const ok = await submitInquiry({ ...formData, source: "contact-form", lang });
    setIsSubmitting(false);
    if (ok) {
      setIsSubmitted(true);
      setFormData(EMPTY_FORM);
    } else {
      setHasError(true);
    }
  };

  return (
    <section className="w-full bg-surface py-gutter-3xl" id="contact-inquiry">
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter-2xl">
          {/* Left/Start Column: Company Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between text-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-1 bg-primary" />
                <span className="font-spec-code text-spec-code uppercase tracking-widest text-primary font-bold">
                  {t.tag}
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-6">
                {t.title}
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8 leading-relaxed">
                {t.description}
              </p>

              {/* Direct Contact Info Cards */}
              <div className="space-y-4">
                {/* فريق التواصل */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONTACT_PEOPLE.map((p) => (
                    <div key={p.id} className="p-5 bg-surface-container-low border-t-2 border-accent">
                      <span className="font-headline-sm text-headline-sm text-on-surface block">{p.name}</span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant block mb-2">
                        {t.roles[p.id]}
                      </span>
                      <a
                        className="font-body-md text-body-md font-semibold text-primary hover:text-on-surface transition-colors"
                        dir="ltr"
                        href={`tel:${p.phoneE164}`}
                      >
                        {p.phoneDisplay}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-surface-container-low flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <span className="font-spec-code text-spec-code text-secondary block uppercase">
                      {t.info.locationTitle}
                    </span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface block mt-0.5">
                      {t.info.locationDesc}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">mail</span>
                  </div>
                  <div className="min-w-0">
                    <span className="font-spec-code text-spec-code text-secondary block uppercase">
                      {t.info.emailTitle}
                    </span>
                    <a
                      className="font-body-md text-body-md font-semibold text-on-surface block mt-0.5 hover:text-primary transition-colors [overflow-wrap:anywhere]"
                      dir="ltr"
                      href={`mailto:${CONTACT_EMAIL}`}
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">language</span>
                  </div>
                  <div>
                    <span className="font-spec-code text-spec-code text-secondary block uppercase">
                      {t.info.websiteTitle}
                    </span>
                    <a
                      className="font-body-md text-body-md font-semibold text-on-surface block mt-0.5 hover:text-primary transition-colors"
                      dir="ltr"
                      href={WEBSITE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {WEBSITE_DISPLAY}
                    </a>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <span className="font-spec-code text-spec-code text-secondary block uppercase">
                      {t.info.hoursTitle}
                    </span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface block mt-0.5">
                      {t.info.hoursValue}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">{t.info.hoursDesc}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right/End Column: Interactive B2B Tender / Inquiry Form */}
          <div className="lg:col-span-7 bg-surface-container-lowest p-8 md:p-10 shadow-xl text-start">
            <div className="mb-8">
              <span className="font-spec-code text-spec-code text-primary uppercase font-bold tracking-widest block mb-1">
                {t.form.tag}
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {t.form.title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {t.form.subtitle}
              </p>
            </div>

            <form className="space-y-5" id="afamia-b2b-form" onSubmit={handleSubmit}>
              {/* honeypot ضد السبام — مخفي عن المستخدمين */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="hidden"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1"
                    htmlFor="contact-name"
                  >
                    {t.form.nameLabel}
                  </label>
                  <input
                    className="w-full h-12 px-4 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-md text-body-md outline-none transition-colors"
                    id="contact-name"
                    placeholder={t.form.namePlaceholder}
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label
                    className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1"
                    htmlFor="company-name"
                  >
                    {t.form.companyLabel}
                  </label>
                  <input
                    className="w-full h-12 px-4 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-md text-body-md outline-none transition-colors"
                    id="company-name"
                    placeholder={t.form.companyPlaceholder}
                    required
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1"
                    htmlFor="contact-phone"
                  >
                    {t.form.phoneLabel}
                  </label>
                  <input
                    className="w-full h-12 px-4 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-md text-body-md outline-none transition-colors"
                    dir="ltr"
                    id="contact-phone"
                    placeholder={t.form.phonePlaceholder}
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label
                    className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1"
                    htmlFor="contact-email"
                  >
                    {t.form.emailLabel}
                  </label>
                  <input
                    className="w-full h-12 px-4 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-md text-body-md outline-none transition-colors"
                    dir="ltr"
                    id="contact-email"
                    placeholder={t.form.emailPlaceholder}
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1"
                  htmlFor="product-select"
                >
                  {t.form.productLabel}
                </label>
                <select
                  className="w-full h-12 px-4 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-md text-body-md outline-none transition-colors cursor-pointer"
                  id="product-select"
                  required
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                >
                  <option disabled value="">
                    {t.form.productSelectDefault}
                  </option>
                  <option value="panels">{t.form.optPanels}</option>
                  <option value="birch-plywood">{t.form.optBirchPlywood}</option>
                  <option value="hardwood">{t.form.optHardwood}</option>
                  <option value="softwood">{t.form.optSoftwood}</option>
                  <option value="veneer">{t.form.optVeneer}</option>
                  <option value="birch-veneer">{t.form.optBirchVeneer}</option>
                  <option value="birch-logs">{t.form.optBirchLogs}</option>
                  <option value="custom-solution">{t.form.optCustom}</option>
                </select>
              </div>

              <div>
                <label
                  className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1"
                  htmlFor="contact-message"
                >
                  {t.form.messageLabel}
                </label>
                <textarea
                  className="w-full p-4 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-md text-body-md outline-none transition-colors resize-none"
                  id="contact-message"
                  placeholder={t.form.messagePlaceholder}
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="pt-2">
                {hasError && (
                  <div
                    role="alert"
                    className="mb-4 p-4 bg-error-container text-on-error-container font-body-sm text-body-sm border border-error/30"
                  >
                    {t.form.error}{" "}
                    <a className="underline font-semibold" dir="ltr" href={`tel:${CONTACT_PHONE_E164}`}>
                      {CONTACT_PHONE_DISPLAY}
                    </a>
                    {" · "}
                    <a className="underline font-semibold" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                )}
                {!isSubmitted ? (
                  <button
                    className="w-full h-14 bg-primary hover:bg-inverse-surface text-on-primary font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer disabled:opacity-50 rounded-full"
                    id="submit-btn"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">
                          refresh
                        </span>
                        <span>{t.form.submitting}</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">send</span>
                        <span>{t.form.submitBtn}</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div
                    className="p-4 bg-surface-container text-primary font-body-md text-body-md text-center border border-primary/20"
                    id="form-feedback"
                  >
                    {t.form.success}
                  </div>
                )}

                {/* بديل الواتساب: يبعت نفس بيانات الفورم كرسالة جاهزة */}
                {!isSubmitted && (
                  <button
                    type="button"
                    onClick={openWhatsApp}
                    className="w-full h-12 mt-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-full border border-[#25D366]/30"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07a8.1 8.1 0 0 1-2.39-1.47 8.96 8.96 0 0 1-1.65-2.06c-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.5 1.7.63.72.23 1.37.2 1.88.12.58-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 1 1 8.38 4.63M12.05 1.6a11.8 11.8 0 0 0-10.2 17.72L.16 24l5.8-1.52a11.8 11.8 0 1 0 6.1-20.87" />
                    </svg>
                    <span>{t.form.waBtn}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
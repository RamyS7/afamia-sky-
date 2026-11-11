
"use client";

import React, { useState } from "react";
import { Dictionary } from "../[lang]/dictionaries";
import { CONTACT_EMAIL, CONTACT_PHONE_E164 } from "../lib/contact";
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
                <div className="p-4 bg-surface-container-low flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      location_on
                    </span>
                  </div>
                  <div>
                    <span className="font-spec-code text-spec-code text-secondary block uppercase">
                      {t.info.locationTitle}
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface block mt-0.5">
                      {t.info.locationDesc}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      phone_in_talk
                    </span>
                  </div>
                  <div>
                    <span className="font-spec-code text-spec-code text-secondary block uppercase">
                      {t.info.phoneTitle}
                    </span>
                    <a
                      className="font-headline-sm text-headline-sm text-on-surface block mt-0.5 hover:text-primary transition-colors"
                      dir="ltr"
                      href={`tel:${CONTACT_PHONE_E164}`}
                    >
                      {t.info.phoneValue}
                    </a>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {t.info.phoneDesc}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      mail
                    </span>
                  </div>
                  <div>
                    <span className="font-spec-code text-spec-code text-secondary block uppercase">
                      {t.info.emailTitle}
                    </span>
                    <a
                      className="font-body-lg text-body-lg font-semibold text-on-surface block mt-0.5 hover:text-primary transition-colors [overflow-wrap:anywhere]"
                      dir="ltr"
                      href={`mailto:${CONTACT_EMAIL}`}
                    >
                      {t.info.emailValue}
                    </a>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {t.info.emailDesc}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-surface-container-low flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      schedule
                    </span>
                  </div>
                  <div>
                    <span className="font-spec-code text-spec-code text-secondary block uppercase">
                      {t.info.hoursTitle}
                    </span>
                    <span className="font-headline-sm text-headline-sm text-on-surface block mt-0.5">
                      {t.info.hoursValue}
                    </span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {t.info.hoursDesc}
                    </span>
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
                  <option value="plywood">{t.form.optPlywood}</option>
                  <option value="red-pine">{t.form.optRedPine}</option>
                  <option value="spruce">{t.form.optSpruce}</option>
                  <option value="birch-logs">{t.form.optBirchLogs}</option>
                  <option value="aspen-logs">{t.form.optAspenLogs}</option>
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
                      {t.info.phoneValue}
                    </a>
                    {" · "}
                    <a className="underline font-semibold" href={`mailto:${CONTACT_EMAIL}`}>
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                )}
                {!isSubmitted ? (
                  <button
                    className="w-full h-14 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer disabled:opacity-50 rounded-full"
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
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
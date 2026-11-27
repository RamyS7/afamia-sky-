
"use client";

import React, { useEffect, useId, useState } from "react";
import { Dictionary } from "../[lang]/dictionaries";
import { inquiryWhatsAppUrl } from "../lib/contact";
import { submitInquiry } from "../lib/submitInquiry";

interface QuickQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Dictionary["quickQuoteModal"];
  contactFormT: Dictionary["contact"]["form"];
  lang: "ar" | "en";
  initialProduct?: string;
  initialMessage?: string;
}

export default function QuickQuoteModal({
  isOpen,
  onClose,
  t,
  contactFormT,
  lang,
  initialProduct = "",
  initialMessage = "",
}: QuickQuoteModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    product: initialProduct || "birch-plywood",
    message: initialMessage || "",
    website: "",
  });

  const uid = useId();
  const fid = (name: string) => `${uid}-${name}`;

  // Esc يقفل المودال + منع scroll الصفحة اللي وراه طول ما هو مفتوح
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const productLabels: Record<string, string> = {
    panels: contactFormT.optPanels,
    "birch-plywood": contactFormT.optBirchPlywood,
    hardwood: contactFormT.optHardwood,
    softwood: contactFormT.optSoftwood,
    veneer: contactFormT.optVeneer,
    "birch-veneer": contactFormT.optBirchVeneer,
    "birch-logs": contactFormT.optBirchLogs,
    "custom-solution": contactFormT.optCustom,
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
    const ok = await submitInquiry({ ...formData, source: "quick-quote", lang });
    setIsSubmitting(false);
    if (ok) setIsSubmitted(true);
    else setHasError(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        // الضغط على الخلفية (برّه الصندوق) يقفل المودال
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={fid("title")}
        className="bg-surface max-w-xl w-full p-6 md:p-8 shadow-2xl relative border border-outline-variant text-start max-h-[90vh] overflow-y-auto"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={t.close}
          className="absolute top-4 end-4 text-on-surface-variant hover:text-on-surface p-2 rounded-full cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>

        <div className="mb-6 pe-10">
          <span className="font-spec-code text-spec-code text-primary uppercase font-bold tracking-widest block mb-1">
            AFAMIA SKY PLYWOOD
          </span>
          <h3 id={fid("title")} className="font-headline-md text-headline-md text-on-surface">
            {t.title}
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {t.subtitle}
          </p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1" htmlFor={fid("name")}>
                  {contactFormT.nameLabel}
                </label>
                <input
                  id={fid("name")}
                  type="text"
                  required
                  placeholder={contactFormT.namePlaceholder}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-11 px-3 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-sm outline-none"
                />
              </div>
              <div>
                <label className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1" htmlFor={fid("company")}>
                  {contactFormT.companyLabel}
                </label>
                <input
                  id={fid("company")}
                  type="text"
                  required
                  placeholder={contactFormT.companyPlaceholder}
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full h-11 px-3 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-sm outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1" htmlFor={fid("phone")}>
                  {contactFormT.phoneLabel}
                </label>
                <input
                  id={fid("phone")}
                  type="tel"
                  required
                  dir="ltr"
                  placeholder={contactFormT.phonePlaceholder}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-11 px-3 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-sm outline-none"
                />
              </div>
              <div>
                <label className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1" htmlFor={fid("email")}>
                  {contactFormT.emailLabel}
                </label>
                <input
                  id={fid("email")}
                  type="email"
                  required
                  dir="ltr"
                  placeholder={contactFormT.emailPlaceholder}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-11 px-3 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-sm outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1" htmlFor={fid("product")}>
                {contactFormT.productLabel}
              </label>
              <select
                id={fid("product")}
                required
                value={formData.product}
                onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                className="w-full h-11 px-3 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-sm outline-none cursor-pointer"
              >
                <option value="panels">{contactFormT.optPanels}</option>
                <option value="birch-plywood">{contactFormT.optBirchPlywood}</option>
                <option value="hardwood">{contactFormT.optHardwood}</option>
                <option value="softwood">{contactFormT.optSoftwood}</option>
                <option value="veneer">{contactFormT.optVeneer}</option>
                <option value="birch-veneer">{contactFormT.optBirchVeneer}</option>
                <option value="birch-logs">{contactFormT.optBirchLogs}</option>
                <option value="custom-solution">{contactFormT.optCustom}</option>
              </select>
            </div>

            <div>
              <label className="block font-spec-code text-spec-code uppercase text-on-surface-variant mb-1" htmlFor={fid("message")}>
                {contactFormT.messageLabel}
              </label>
              <textarea
                id={fid("message")}
                rows={3}
                required
                placeholder={contactFormT.messagePlaceholder}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 bg-surface-container-low focus:bg-surface-container text-on-surface font-body-sm outline-none resize-none"
              />
            </div>

            {hasError && (
              <div
                role="alert"
                className="p-3 bg-error-container text-on-error-container font-body-sm text-body-sm border border-error/30"
              >
                {t.error}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-primary hover:bg-inverse-surface text-on-primary font-label-md uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer rounded-full"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
                    <span>{t.sending}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                    <span>{t.send}</span>
                  </>
                )}
              </button>

              {/* بديل الواتساب: يبعت نفس بيانات الفورم كرسالة جاهزة */}
              <button
                type="button"
                onClick={openWhatsApp}
                className="w-full h-11 mt-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] font-label-md text-label-md uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-full border border-[#25D366]/30"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07a8.1 8.1 0 0 1-2.39-1.47 8.96 8.96 0 0 1-1.65-2.06c-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.5 1.7.63.72.23 1.37.2 1.88.12.58-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 1 1 8.38 4.63M12.05 1.6a11.8 11.8 0 0 0-10.2 17.72L.16 24l5.8-1.52a11.8 11.8 0 1 0 6.1-20.87" />
                </svg>
                <span>{contactFormT.waBtn}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>
            <p className="font-body-md text-on-surface">{t.success}</p>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-surface-container text-on-surface hover:bg-surface-container-high font-label-md uppercase cursor-pointer rounded-full"
            >
              {t.close}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export interface InquiryPayload {
  name: string;
  company: string;
  phone: string;
  email: string;
  product: string;
  message: string;
  website?: string; // honeypot
  source: "contact-form" | "quick-quote";
  lang: "ar" | "en";
}

/** يرسل الطلب لـ /api/contact ويرجع true لو اتبعت فعلاً */
export async function submitInquiry(payload: InquiryPayload): Promise<boolean> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return false;
    const json = (await res.json()) as { ok?: boolean };
    return json.ok === true;
  } catch {
    return false;
  }
}

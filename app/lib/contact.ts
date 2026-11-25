// بيانات التواصل الرسمية — مصدر واحد لكل الموقع
export const CONTACT_PHONE_DISPLAY = "+20 100 639 1550";
export const CONTACT_PHONE_E164 = "+201006391550";
// الإيميل المعروض للزوار (من ملف العرض)
export const CONTACT_EMAIL = "plywood.afamia.llc@gmail.com";
// الإيميل اللي بتوصله طلبات الفورم — سيبناه على الصندوق القديم لأنه متفعّل مع FormSubmit؛
// غيّره هنا (أو بمتغير CONTACT_TO_EMAIL) لو العميل عايز الطلبات توصل للإيميل الجديد
export const INQUIRY_EMAIL = "afamiaplywood@gmail.com";
export const WEBSITE_URL = "https://www.afamiaplywood.com";
export const WEBSITE_DISPLAY = "www.afamiaplywood.com";

// فريق التواصل (من ملف العرض) — الدور بيتترجم من القاموس
export const CONTACT_PEOPLE = [
  { id: "gm", name: "Mahmoud Elnagar", phoneDisplay: "+20 100 639 1550", phoneE164: "+201006391550" },
  { id: "sales", name: "Farid Abdo", phoneDisplay: "+20 115 008 9957", phoneE164: "+201150089957" },
] as const;
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61594089157605";

export const whatsappLink = (message: string) =>
  `https://wa.me/${CONTACT_PHONE_E164.replace("+", "")}?text=${encodeURIComponent(message)}`;

/** يبني لينك واتساب فيه بيانات الفورم كرسالة جاهزة — الحقول الفاضية بتتشال */
export function inquiryWhatsAppUrl(
  d: { name: string; company: string; phone: string; email: string; productLabel: string; message: string },
  lang: "ar" | "en"
) {
  const L =
    lang === "ar"
      ? { h: "طلب جديد من موقع AFAMIA SKY", n: "الاسم", c: "الشركة", p: "الهاتف", e: "الإيميل", pr: "المنتج", m: "التفاصيل" }
      : { h: "New inquiry from the Afamia website", n: "Name", c: "Company", p: "Phone", e: "Email", pr: "Product", m: "Details" };
  const line = (k: string, v: string) => (v.trim() ? `${k}: ${v.trim()}` : null);
  const lines = [
    `*${L.h}*`,
    line(L.n, d.name),
    line(L.c, d.company),
    line(L.p, d.phone),
    line(L.e, d.email),
    line(L.pr, d.productLabel),
    line(L.m, d.message),
  ].filter(Boolean) as string[];
  return whatsappLink(lines.join("\n"));
}

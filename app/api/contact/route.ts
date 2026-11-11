import nodemailer from "nodemailer";
import { CONTACT_EMAIL } from "../../lib/contact";

// يستقبل طلبات فورم التواصل ومودال عرض السعر ويرسلها لإيميل المصنع عبر Gmail SMTP.
// يتطلب متغيرَي البيئة GMAIL_USER و GMAIL_APP_PASSWORD (App Password من إعدادات حساب جوجل).

const PRODUCTS: Record<string, string> = {
  plywood: "أبلكاش (Plywood)",
  "red-pine": "صنوبر أحمر (Red Pine)",
  spruce: "تنوب (Spruce)",
  "birch-logs": "جزوع بتولا (Birch Logs)",
  "aspen-logs": "جزوع حور (Aspen Logs)",
  "custom-solution": "حلول خاصة (Custom)",
};

const LIMITS = { name: 120, company: 160, phone: 40, email: 160, message: 4000 } as const;

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // honeypot: حقل مخفي، البوتات بس اللي بتملاه
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const data = {
    name: clean(body.name, LIMITS.name),
    company: clean(body.company, LIMITS.company),
    phone: clean(body.phone, LIMITS.phone),
    email: clean(body.email, LIMITS.email),
    message: clean(body.message, LIMITS.message),
    product: clean(body.product, 40),
    source: body.source === "quick-quote" ? "quick-quote" : "contact-form",
    lang: body.lang === "en" ? "en" : "ar",
  };

  if (
    !data.name ||
    !data.company ||
    !data.phone ||
    !data.message ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) ||
    !(data.product in PRODUCTS)
  ) {
    return Response.json({ ok: false, error: "invalid_fields" }, { status: 400 });
  }

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) {
    console.error("[contact] GMAIL_USER / GMAIL_APP_PASSWORD are not set — email not sent");
    return Response.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const productLabel = PRODUCTS[data.product];
  const sourceLabel = data.source === "quick-quote" ? "طلب عرض سعر سريع" : "فورم تواصل معنا";
  const rows: [string, string][] = [
    ["الاسم", data.name],
    ["الشركة", data.company],
    ["الهاتف", data.phone],
    ["البريد الإلكتروني", data.email],
    ["المنتج", productLabel],
    ["المصدر", `${sourceLabel} (${data.lang.toUpperCase()})`],
  ];

  const html = `
    <div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#222">
      <h2 style="color:#7a4a1c">طلب جديد من موقع أفاميا</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="font-weight:bold;border-bottom:1px solid #eee">${k}</td><td style="border-bottom:1px solid #eee" dir="auto">${escapeHtml(v)}</td></tr>`
          )
          .join("")}
      </table>
      <h3>تفاصيل الطلب</h3>
      <p style="white-space:pre-wrap" dir="auto">${escapeHtml(data.message)}</p>
    </div>`;

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nتفاصيل الطلب:\n${data.message}`;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
    await transporter.sendMail({
      from: `"موقع أفاميا" <${user}>`,
      to: process.env.CONTACT_TO_EMAIL || CONTACT_EMAIL,
      replyTo: `"${data.name.replace(/"/g, "")}" <${data.email}>`,
      subject: `${sourceLabel}: ${data.company} — ${productLabel}`,
      text,
      html,
    });
  } catch (err) {
    console.error("[contact] send failed", err);
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}

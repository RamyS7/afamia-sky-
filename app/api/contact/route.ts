import nodemailer from "nodemailer";
import { INQUIRY_EMAIL } from "../../lib/contact";

// يستقبل طلبات فورم التواصل ومودال عرض السعر ويرسلها لإيميل المصنع.
// الإرسال بطريقتين:
// 1) لو GMAIL_USER و GMAIL_APP_PASSWORD متظبطين ← Gmail SMTP مباشرة (الأفضل).
// 2) غير كده ← خدمة FormSubmit المجانية (من غير باسورد، بس البيانات بتعدي على سيرفرهم،
//    وأول إرسال بيبعت إيميل تفعيل لصندوق afamiaplywood@gmail.com لازم يتداس على اللينك اللي فيه مرة واحدة).

const PRODUCTS: Record<string, string> = {
  panels: "ألواح خشبية (Panels)",
  "birch-plywood": "أبلكاش بتولا (Birch plywood)",
  hardwood: "أخشاب صلبة (Hardwood)",
  softwood: "أخشاب لينة (Softwood)",
  veneer: "قشرة خشب (Veneer)",
  "birch-veneer": "فينير بتولا (Birch veneer)",
  "birch-logs": "جذوع بتولا (Birch logs)",
  "custom-solution": "طلب آخر / متطلبات خاصة (Custom)",
};

const LIMITS = { name: 120, company: 160, phone: 40, email: 160, message: 4000 } as const;

// حد بسيط لعدد الطلبات من نفس العنوان (في الذاكرة — بيحمي من الإغراق العادي،
// ومش بديل عن حماية الاستضافة لو حصل هجوم حقيقي).
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const MAX_BODY_BYTES = 20_000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(k);
  }
  return recent.length > RATE_MAX;
}

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "too_many_requests" }, { status: 429 });
  }

  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_BODY_BYTES) {
    return Response.json({ ok: false, error: "payload_too_large" }, { status: 413 });
  }

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return Response.json({ ok: false, error: "payload_too_large" }, { status: 413 });
    }
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
    }
    body = parsed as Record<string, unknown>;
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
    <div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;color:#102332">
      <h2 style="color:#102332">طلب جديد من موقع AFAMIA SKY</h2>
      <table cellpadding="6" style="border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="font-weight:bold;border-bottom:1px solid #e8ddcb">${k}</td><td style="border-bottom:1px solid #e8ddcb" dir="auto">${escapeHtml(v)}</td></tr>`
          )
          .join("")}
      </table>
      <h3>تفاصيل الطلب</h3>
      <p style="white-space:pre-wrap" dir="auto">${escapeHtml(data.message)}</p>
    </div>`;

  const text =
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nتفاصيل الطلب:\n${data.message}`;

  const to = process.env.CONTACT_TO_EMAIL || INQUIRY_EMAIL;
  const subject = `${sourceLabel}: ${data.company} — ${productLabel}`;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  try {
    if (user && pass) {
      // الطريقة المباشرة: Gmail SMTP
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user, pass },
      });
      await transporter.sendMail({
        from: `"موقع AFAMIA SKY" <${user}>`,
        to,
        replyTo: `"${data.name.replace(/"/g, "")}" <${data.email}>`,
        subject,
        text,
        html,
      });
    } else {
      // البديل من غير باسورد: FormSubmit
      const res = await fetch(`https://formsubmit.co/ajax/${to}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _subject: subject,
          _template: "table",
          _replyto: data.email,
          "الاسم": data.name,
          "الشركة": data.company,
          "الهاتف": data.phone,
          "الإيميل": data.email,
          "المنتج": productLabel,
          "المصدر": `${sourceLabel} (${data.lang.toUpperCase()})`,
          "تفاصيل الطلب": data.message,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { success?: string | boolean };
      if (!res.ok || !(json.success === true || json.success === "true")) {
        console.error("[contact] FormSubmit failed", res.status, json);
        return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
      }
    }
  } catch (err) {
    console.error("[contact] send failed", err);
    return Response.json({ ok: false, error: "send_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}

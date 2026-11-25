# AFAMIA SKY PLYWOOD LLC — Website

موقع ثنائي اللغة (عربي RTL افتراضي / English) لمصنع أفاميا سكاي بلاي وود، الإسكندرية.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4.

## التشغيل
```bash
npm install
npm run dev        # http://localhost:3000  (يحوّل تلقائيًا إلى /ar)
npm run lint
npm run build && npm start
```

## الهيكل
- `app/[lang]/` الصفحة والقواميس (`dictionaries/ar.json`, `en.json` — لازم نفس المفاتيح في الاتنين).
- `app/components/` أقسام الصفحة.
- `app/lib/contact.ts` بيانات التواصل (تليفون، إيميل، أشخاص). عدّلها من مكان واحد.
- `app/api/contact/route.ts` استقبال الفورم وإرساله بالإيميل (حد 5 طلبات/10 دقايق لكل IP).
- `proxy.ts` تحويل أي مسار بدون لغة إلى `/ar`.

## إعداد الإيميل
انسخ `.env.example` إلى `.env.local` واملا `GMAIL_USER` و`GMAIL_APP_PASSWORD` (App Password من حساب جوجل بعد تفعيل التحقق بخطوتين).
بدونهم يستخدم الموقع خدمة FormSubmit كبديل (البيانات بتعدي على سيرفرهم). على Vercel ضيف نفس المتغيرات من Settings → Environment Variables، ومعاهم `NEXT_PUBLIC_SITE_URL`.

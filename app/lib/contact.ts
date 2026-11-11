// بيانات التواصل الرسمية — مصدر واحد لكل الموقع
export const CONTACT_PHONE_DISPLAY = "+20 100 639 1550";
export const CONTACT_PHONE_E164 = "+201006391550";
export const CONTACT_EMAIL = "afamiaplywood@gmail.com";
export const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61594089157605";

export const whatsappLink = (message: string) =>
  `https://wa.me/${CONTACT_PHONE_E164.replace("+", "")}?text=${encodeURIComponent(message)}`;

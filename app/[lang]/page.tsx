import HomeContent from "../components/HomeContent";
import { getDictionary } from "./dictionaries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const validLang = lang === "en" ? "en" : "ar";
  const t = await getDictionary(validLang);

  return <HomeContent lang={validLang} t={t} />;
}

import TopBar from "@/components/portfolio/TopBar";
import Footer from "@/components/portfolio/Footer";
import FloatingNav from "@/components/portfolio/FloatingNav";
import connectToDatabase from "@/lib/db";
import { PortfolioSettings } from "@/models/PortfolioSettings";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let heroName = "ANIT KUSHWAHA";
  let resumeUrl = undefined;
  let social = undefined;

  try {
    await connectToDatabase();
    const settings = await PortfolioSettings.findOne().lean();
    if (settings) {
      if (settings.hero?.name) heroName = settings.hero.name;
      if (settings.hero?.resumeUrl) resumeUrl = settings.hero.resumeUrl;
      if (settings.social) social = JSON.parse(JSON.stringify(settings.social));
    }
  } catch {
    // fallback to defaults
  }

  return (
    <>
      <TopBar name={heroName} resumeUrl={resumeUrl} social={social} />
      <FloatingNav />
      {children}
      <Footer name={heroName} />
    </>
  );
}

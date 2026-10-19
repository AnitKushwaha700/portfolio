import TopBar from "@/components/portfolio/TopBar";
import Footer from "@/components/portfolio/Footer";
import Home3DExperience from "@/components/portfolio/Home3DExperience";
import connectToDatabase from "@/lib/db";
import { PortfolioSettings } from "@/models/PortfolioSettings";

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let heroName = "ANIT KUSHWAHA";
  let social = undefined;

  try {
    await connectToDatabase();
    const settings = await PortfolioSettings.findOne().lean();
    if (settings) {
      if (settings.hero?.name) heroName = settings.hero.name;
      if (settings.social) social = JSON.parse(JSON.stringify(settings.social));
    }
  } catch {
    // fallback
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#07070d] text-gray-100 flex flex-col">
      {/* 3D Cyber Vortex & Constellation Background (Same as Home) */}
      <Home3DExperience />

      {/* Ambient Radial Backlights (Same as Home) */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[170px] pointer-events-none z-0" />

      {/* Header TopBar Navigation */}
      <TopBar name={heroName} social={social} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full pt-16 sm:pt-20">
        {children}
      </main>

      {/* Footer */}
      <Footer name={heroName} />
    </div>
  );
}

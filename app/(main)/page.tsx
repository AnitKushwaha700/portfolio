import connectToDatabase from "@/lib/db";
import { PortfolioSettings } from "@/models/PortfolioSettings";
import { Project } from "@/models/Project";
import { Experience } from "@/models/Experience";
import { Skill } from "@/models/Skill";
import { Education } from "@/models/Education";
import { Hackathon } from "@/models/Hackathon";

import Hero from "@/components/portfolio/Hero";
import About from "@/components/portfolio/About";
import Skills from "@/components/portfolio/Skills";
import ExperienceSection from "@/components/portfolio/Experience";
import Projects from "@/components/portfolio/Projects";
import EducationSection from "@/components/portfolio/Education";
import Hackathons from "@/components/portfolio/Hackathons";
import Contact from "@/components/portfolio/Contact";
import Home3DExperience from "@/components/portfolio/Home3DExperience";

export const dynamic = "force-dynamic";

export default async function Home() {
  let settings: any = null;
  let projects: any[] = [];
  let experiences: any[] = [];
  let skills: any[] = [];
  let education: any[] = [];
  let hackathons: any[] = [];

  try {
    await connectToDatabase();

    const rawSettings = await PortfolioSettings.findOne().lean();
    if (rawSettings) {
      settings = JSON.parse(JSON.stringify(rawSettings));
    }

    if (settings) {
      const { sectionVisibility } = settings;

      const [rawProjects, rawExperiences, rawSkills, rawEducation, rawHackathons] =
        await Promise.all([
          sectionVisibility.projects
            ? Project.find({ visible: true }).sort({ order: 1 }).lean()
            : [],
          sectionVisibility.experience
            ? Experience.find({ visible: true }).sort({ order: 1 }).lean()
            : [],
          sectionVisibility.skills
            ? Skill.find({ visible: true }).sort({ order: 1 }).lean()
            : [],
          sectionVisibility.education
            ? Education.find({ visible: true }).sort({ order: 1 }).lean()
            : [],
          sectionVisibility.hackathon
            ? Hackathon.find({ visible: true }).sort({ date: -1 }).lean()
            : [],
        ]);

      projects = JSON.parse(JSON.stringify(rawProjects));
      experiences = JSON.parse(JSON.stringify(rawExperiences));
      skills = JSON.parse(JSON.stringify(rawSkills));
      education = JSON.parse(JSON.stringify(rawEducation));
      hackathons = JSON.parse(JSON.stringify(rawHackathons));
    }
  } catch (error) {
    console.warn(
      "[HOME] Warning: Database connection failed. Render fallback mode enabled:",
      error,
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070d]">
        <div className="text-center p-8 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mx-auto flex items-center justify-center font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-white">Portfolio Initializing</h2>
          <p className="text-sm text-gray-400">
            Connecting to cloud services. If this is a fresh deployment, please ensure
            your MongoDB Atlas cluster URI is configured in your hosting environment variables.
          </p>
        </div>
      </div>
    );
  }

  const { sectionVisibility } = settings;

  return (
    <div className="relative flex flex-col gap-0 w-full overflow-x-clip bg-[#07070d]">
      <Home3DExperience />
      {sectionVisibility.hero && (
        <Hero
          settings={settings}
          skills={skills}
          experiences={experiences}
          projects={projects}
        />
      )}
      {sectionVisibility.about && <About settings={settings} />}
      {sectionVisibility.skills && <Skills skills={skills} />}
      {sectionVisibility.experience && (
        <ExperienceSection experiences={experiences} />
      )}
      {sectionVisibility.projects && <Projects projects={projects} />}
      {sectionVisibility.education && (
        <EducationSection education={education} />
      )}
      {sectionVisibility.hackathon && <Hackathons hackathons={hackathons} />}
      {sectionVisibility.contact && <Contact settings={settings} />}
    </div>
  );
}

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

export default async function Home() {
  await connectToDatabase();

  const rawSettings = await PortfolioSettings.findOne().lean();
  const settings = JSON.parse(JSON.stringify(rawSettings));

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">
          Portfolio is currently being set up. Please check back later.
        </p>
      </div>
    );
  }

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

  const projects = JSON.parse(JSON.stringify(rawProjects));
  const experiences = JSON.parse(JSON.stringify(rawExperiences));
  const skills = JSON.parse(JSON.stringify(rawSkills));
  const education = JSON.parse(JSON.stringify(rawEducation));
  const hackathons = JSON.parse(JSON.stringify(rawHackathons));

  return (
    <div className="flex flex-col gap-0 w-full overflow-hidden">
      {sectionVisibility.hero && <Hero settings={settings} />}
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

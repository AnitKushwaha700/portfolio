import Link from "next/link";
import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import { Experience } from "@/models/Experience";
import { Skill } from "@/models/Skill";
import { PortfolioSettings } from "@/models/PortfolioSettings";
import {
  FileText,
  FolderGit2,
  Briefcase,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  let projectsCount = 0;
  let experienceCount = 0;
  let skillsCount = 0;
  let settings: any = null;

  try {
    await connectToDatabase();

    const [pCount, eCount, sCount, sDoc] = await Promise.all([
      Project.countDocuments(),
      Experience.countDocuments(),
      Skill.countDocuments(),
      PortfolioSettings.findOne().lean<any>(),
    ]);

    projectsCount = pCount;
    experienceCount = eCount;
    skillsCount = sCount;
    settings = sDoc;
  } catch (error) {
    console.warn("[ADMIN_DASHBOARD] Could not fetch dashboard metrics:", error);
  }

  const hasResume =
    settings?.hero?.resumeUrl &&
    settings.hero.resumeUrl !== "#" &&
    settings.hero.resumeUrl.trim().length > 0;

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Welcome back! Here is a summary of your portfolio data and quick management tools.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase font-semibold">Total Projects</span>
            <FolderGit2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-3xl font-bold text-gray-100 mt-2">
            {projectsCount}
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase font-semibold">Experience</span>
            <Briefcase className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-3xl font-bold text-gray-100 mt-2">
            {experienceCount}
          </p>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs uppercase font-semibold">Skills Listed</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Active
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-100 mt-2">{skillsCount}</p>
        </div>

        {/* Resume Status Card */}
        <div className="bg-card p-6 rounded-2xl border border-gray-800 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs uppercase font-semibold">Resume Status</span>
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-center gap-2 mt-2.5">
              {hasResume ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-base font-bold text-emerald-400">
                    Published
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span className="text-base font-bold text-amber-400">
                    Not Added
                  </span>
                </>
              )}
            </div>
          </div>
          <Link
            href="/admin/resume"
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 mt-3 transition-colors"
          >
            <span>{hasResume ? "Manage Resume" : "Upload Resume"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-card rounded-2xl border border-gray-800 p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-gray-100">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/admin/resume"
            className="p-4 rounded-xl bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 hover:border-indigo-500/40 transition-all flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200 group-hover:text-indigo-300 transition-colors">
                Resume Center
              </p>
              <p className="text-xs text-gray-400">Upload or link CV</p>
            </div>
          </Link>

          <Link
            href="/admin/projects"
            className="p-4 rounded-xl bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 hover:border-indigo-500/40 transition-all flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200 group-hover:text-indigo-300 transition-colors">
                Projects
              </p>
              <p className="text-xs text-gray-400">Add or edit projects</p>
            </div>
          </Link>

          <Link
            href="/admin/hero"
            className="p-4 rounded-xl bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 hover:border-indigo-500/40 transition-all flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:scale-110 transition-transform">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200 group-hover:text-indigo-300 transition-colors">
                Hero Settings
              </p>
              <p className="text-xs text-gray-400">Headline & avatar</p>
            </div>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="p-4 rounded-xl bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 hover:border-indigo-500/40 transition-all flex items-center gap-3.5 group cursor-pointer"
          >
            <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <ExternalLink className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200 group-hover:text-emerald-300 transition-colors">
                Live Portfolio
              </p>
              <p className="text-xs text-gray-400">View public site</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

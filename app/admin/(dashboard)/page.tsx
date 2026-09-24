import connectToDatabase from "@/lib/db";
import { Project } from "@/models/Project";
import { Experience } from "@/models/Experience";
import { Skill } from "@/models/Skill";
import { PortfolioSettings } from "@/models/PortfolioSettings";

export default async function AdminDashboard() {
  await connectToDatabase();

  const [projectsCount, experienceCount, skillsCount, settings] =
    await Promise.all([
      Project.countDocuments(),
      Experience.countDocuments(),
      Skill.countDocuments(),
      PortfolioSettings.findOne(),
    ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-100 mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Total Projects</h3>
          <p className="text-3xl font-bold text-gray-100 mt-2">
            {projectsCount}
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">
            Experience Entries
          </h3>
          <p className="text-3xl font-bold text-gray-100 mt-2">
            {experienceCount}
          </p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Skills Listed</h3>
          <p className="text-3xl font-bold text-gray-100 mt-2">{skillsCount}</p>
        </div>
        <div className="bg-card p-6 rounded-xl border border-gray-800">
          <h3 className="text-gray-400 text-sm font-medium">Profile</h3>
          <p className="text-xl font-bold text-gray-100 mt-2 line-clamp-1">
            {settings?.hero?.name || "Anit Kushwaha"}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-bold text-gray-100 mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          {/* Add buttons or links for quick actions here */}
          <p className="text-gray-400">
            Welcome to your portfolio admin dashboard. Use the sidebar to
            navigate and manage your content.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Code2,
  Trophy,
  Link as LinkIcon,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Hero Settings", href: "/admin/hero", icon: User },
  { name: "About", href: "/admin/about", icon: User },
  { name: "Skills", href: "/admin/skills", icon: Code2 },
  { name: "Experience", href: "/admin/experience", icon: Briefcase },
  { name: "Projects", href: "/admin/projects", icon: FolderGit2 },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Hackathon", href: "/admin/hackathon", icon: Trophy },
  { name: "Social Links", href: "/admin/social", icon: LinkIcon },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      // Use window.location.href to force a hard reload so the middleware kicks in cleanly
      window.location.replace("/");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-gray-800 flex items-center justify-between px-4 z-40">
        <h1 className="text-xl font-bold text-gray-100">Admin</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-300 p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-card border-r border-gray-800 flex flex-col z-50 transform transition-transform duration-200 ease-in-out md:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-gray-100">Portfolio Admin</h1>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-300 p-1"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-600/10 text-indigo-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 mr-3 ${isActive ? "text-indigo-400" : "text-gray-500"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3 text-red-500" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

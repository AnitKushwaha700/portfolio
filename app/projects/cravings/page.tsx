import type { Metadata } from "next";
import { projects } from "@/data/projects";
import ProjectDetail from "@/components/ProjectDetail";
import { notFound } from "next/navigation";

const project = projects.find((p) => p.slug === "cravings");

export const metadata: Metadata = {
  title: `${project?.name} — Anit Kushwaha`,
  description: project?.description,
};

export default function CravingsPage() {
  if (!project) return notFound();
  return <ProjectDetail project={project} />;
}

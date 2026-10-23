/**
 * Shared TypeScript types for the portfolio application.
 * All components, API routes, and utilities should use these types
 * instead of inline type definitions or `any`.
 */

// ─── Portfolio Settings ───────────────────────────────────────────────────────

export interface SectionVisibility {
  hero: boolean;
  about: boolean;
  skills: boolean;
  experience: boolean;
  projects: boolean;
  education: boolean;
  hackathon: boolean;
  github: boolean;
  contact: boolean;
}

export interface SeoSettings {
  title: string;
  description: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  /** Phone is masked in public API responses */
  phone: string;
}

export interface HeroSettings {
  name: string;
  role: string;
  headline?: string;
  description: string;
  profileImage: string;
  resumeUrl: string;
  showButtons: boolean;
  showProfileImage: boolean;
  statusText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export interface AboutSettings {
  content: string;
}

export interface PortfolioSettingsData {
  _id: string;
  sectionVisibility: SectionVisibility;
  seo: SeoSettings;
  social: SocialLinks;
  hero: HeroSettings;
  about: AboutSettings;
  createdAt: string;
  updatedAt: string;
}

// ─── Project ──────────────────────────────────────────────────────────────────

export interface ProjectContent {
  overview: string;
  problem: string;
  solution: string;
  myContribution: string;
  challenges: string;
  learning: string;
}

export interface ProjectData {
  _id: string;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  features: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  visible: boolean;
  order: number;
  content: ProjectContent;
  createdAt: string;
  updatedAt: string;
}

// ─── Experience ───────────────────────────────────────────────────────────────

export interface ExperienceData {
  _id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Education ────────────────────────────────────────────────────────────────

export interface EducationData {
  _id: string;
  institution: string;
  degree: string;
  location: string;
  startDate: string;
  endDate: string;
  score: string;
  certificateUrl?: string;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Skill ────────────────────────────────────────────────────────────────────

export type SkillCategory =
  | "Programming Languages"
  | "Frontend"
  | "Backend"
  | "Databases"
  | "Core CS"
  | "Tools";

export interface SkillData {
  _id: string;
  name: string;
  category: SkillCategory;
  icon: string;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Hackathon ────────────────────────────────────────────────────────────────

export interface HackathonContent {
  overview?: string;
  problem?: string;
  solution?: string;
  myContribution?: string;
  challenges?: string;
  learning?: string;
}

export interface HackathonData {
  _id: string;
  title: string;
  slug: string;
  organization: string;
  date: string;
  description: string;
  location: string;
  link: string;
  image: string;
  certificateUrl?: string;
  technologies: string[];
  features: string[];
  content: HackathonContent;
  visible: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Admin User ───────────────────────────────────────────────────────────────

export interface AdminUserData {
  _id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export interface SessionPayload {
  email: string;
  expires: Date;
  iat?: number;
  exp?: number;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: string;
  errorId?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─── Component Props ──────────────────────────────────────────────────────────

export interface HeroProps {
  settings: PortfolioSettingsData;
  skills: SkillData[];
  experiences: ExperienceData[];
  projects: ProjectData[];
}

export interface AboutProps {
  settings: PortfolioSettingsData;
}

export interface SkillsProps {
  skills: SkillData[];
}

export interface ExperienceProps {
  experiences: ExperienceData[];
}

export interface ProjectsProps {
  projects: ProjectData[];
}

export interface EducationProps {
  education: EducationData[];
}

export interface HackathonsProps {
  hackathons: HackathonData[];
}

export interface ContactProps {
  settings: PortfolioSettingsData;
}

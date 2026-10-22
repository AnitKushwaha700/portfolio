/**
 * Application-wide constants.
 * Never use magic strings or numbers directly in code — import from here.
 */

// ─── App Identity ─────────────────────────────────────────────────────────────

export const APP_NAME = "Anit Kushwaha Portfolio" as const;
export const APP_AUTHOR = "Anit Kushwaha" as const;
export const APP_ROLE = "Software Developer" as const;

// ─── Auth & Session ───────────────────────────────────────────────────────────

/** Name of the httpOnly session cookie */
export const COOKIE_NAME = "session" as const;

/** Session lifetime: 24 hours in milliseconds */
export const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

/** JWT algorithm used for signing session tokens */
export const JWT_ALGORITHM = "HS256" as const;

// ─── Rate Limiting ────────────────────────────────────────────────────────────

/** Rolling window for rate limiting (1 minute) */
export const RATE_LIMIT_WINDOW_MS = 60 * 1000;

/** Maximum login attempts per IP within the rate limit window */
export const RATE_LIMIT_MAX_ATTEMPTS = 5;

// ─── Database ─────────────────────────────────────────────────────────────────

/** Mongoose connection option: disable command buffering */
export const MONGOOSE_BUFFER_COMMANDS = false;

// ─── File Upload ──────────────────────────────────────────────────────────────

/** Max file size for uploads: 10 MB */
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Cloudinary folder for portfolio assets */
export const CLOUDINARY_FOLDER = "digital_portfolio" as const;

/** File extensions that must be uploaded as raw (not image-processed) */
export const RAW_FILE_EXTENSIONS = new Set([
  "pdf",
  "doc",
  "docx",
  "txt",
  "csv",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "zip",
]);

// ─── Skill Categories ─────────────────────────────────────────────────────────

export const SKILL_CATEGORIES = [
  "Programming Languages",
  "Frontend",
  "Backend",
  "Databases",
  "Core CS",
  "Tools",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];

// ─── API Paths ────────────────────────────────────────────────────────────────

export const API_PATHS = {
  AUTH_LOGIN: "/api/auth/login",
  AUTH_LOGOUT: "/api/auth/logout",
  AUTH_ACCOUNT: "/api/auth/account",
  PROJECTS: "/api/projects",
  SKILLS: "/api/skills",
  EXPERIENCE: "/api/experience",
  EDUCATION: "/api/education",
  HACKATHON: "/api/hackathon",
  SETTINGS: "/api/settings",
  UPLOAD: "/api/upload",
} as const;

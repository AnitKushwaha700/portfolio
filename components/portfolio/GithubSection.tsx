"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  GitCommit,
  Flame,
  Trophy,
  ExternalLink,
  Star,
  GitFork,
  BookMarked,
  Calendar,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface GithubData {
  username: string;
  year: string;
  totalContributions: number;
  currentStreak: number;
  longestStreak: number;
  contributions: ContributionDay[];
}

interface PinnedRepo {
  name: string;
  fullName?: string;
  description: string;
  language: string;
  languageColor: string;
  stars?: number;
  forks?: number;
  tag?: string;
  url: string;
}

// 6 Pinned Repositories matching AnitKushwaha700's GitHub profile screenshot
const PINNED_REPOS: PinnedRepo[] = [
  {
    name: "Authentication-User-Management-API",
    description:
      "Production-ready user authentication & RBAC system with secure JWT sessions, refresh tokens, and MongoDB validation.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    url: "https://github.com/AnitKushwaha700/Authentication-User-Management-API",
  },
  {
    name: "ChatApp",
    description:
      "Real-time communication platform supporting instant messaging, WebSocket signaling, and peer-to-peer audio/video calling.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    url: "https://github.com/AnitKushwaha700/ChatApp",
  },
  {
    name: "Cravings",
    description:
      "Full-stack distributed food delivery platform with dynamic restaurant menus, real-time cart state, and order tracking.",
    language: "JavaScript",
    languageColor: "#f1e05a",
    url: "https://github.com/AnitKushwaha700/Cravings",
  },
  {
    name: "portfolio",
    description:
      "Cyber-themed 3D portfolio powered by Next.js, Three.js canvas vortex, Framer Motion volumetric smoke, and MongoDB CMS.",
    language: "TypeScript",
    languageColor: "#3178c6",
    url: "https://github.com/AnitKushwaha700/portfolio",
  },
  {
    name: "ResumePilot-AI",
    fullName: "ayushh-3006/ResumePilot-AI",
    description:
      "AI resume builder & ATS scoring system built for tech hackathons. Generates personalized career suggestions and PDF exports.",
    language: "TypeScript",
    languageColor: "#3178c6",
    tag: "Hackathon",
    stars: 5,
    forks: 1,
    url: "https://github.com/ayushh-3006/ResumePilot-AI",
  },
  {
    name: "TalkMe-AI",
    description:
      "Conversational voice assistant leveraging Web Speech API, LLM completion, and streaming low-latency response generation.",
    language: "TypeScript",
    languageColor: "#3178c6",
    url: "https://github.com/AnitKushwaha700/TalkMe-AI",
  },
];

// GitHub level colors
const LEVEL_COLORS: Record<number, string> = {
  0: "#161b22", // empty
  1: "#0e4429", // light green
  2: "#006d32", // medium green
  3: "#26a641", // bright green
  4: "#39d353", // intense green
};

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Helper to format date with weekday in tooltips (e.g., "Fri, Mar 20, 2026")
function formatTooltipDate(dateStr: string) {
  try {
    const [y, m, d] = dateStr.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function GithubSection({
  githubUrl = "https://github.com/AnitKushwaha700",
}: {
  githubUrl?: string;
}) {
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [data, setData] = useState<GithubData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  const heatmapScrollRef = useRef<HTMLDivElement>(null);

  const handleYearChange = (year: string) => {
    if (year === selectedYear) return;
    setLoading(true);
    setSelectedYear(year);
  };

  // When data loads, auto-scroll to the right so recent months / active streak are immediately visible on mobile
  useEffect(() => {
    if (!loading && heatmapScrollRef.current) {
      const el = heatmapScrollRef.current;
      const scrollTimer = setTimeout(() => {
        el.scrollLeft = el.scrollWidth;
      }, 50);
      return () => clearTimeout(scrollTimer);
    }
  }, [loading, selectedYear]);

  // Dismiss tooltip on outside touch/click
  useEffect(() => {
    const handleOutsideClick = () => {
      setHoveredDay(null);
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleDayInteraction = (
    e: React.MouseEvent,
    day: ContributionDay
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setHoveredDay((prev) =>
      prev?.date === day.date
        ? null
        : {
            date: day.date,
            count: day.count,
            x: rect.left + rect.width / 2,
            y: rect.top - 8,
          }
    );
  };

  // Fetch streak & contribution data from API route
  useEffect(() => {
    let isMounted = true;

    const fetchStreak = async () => {
      try {
        const res = await fetch(
          `/api/github/streak?username=AnitKushwaha700&year=${selectedYear}`,
        );
        const resData = await res.json();
        if (isMounted) {
          setData(resData);
          setLoading(false);
        }
      } catch (err) {
        console.warn("Failed to load GitHub streak data:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchStreak();

    return () => {
      isMounted = false;
    };
  }, [selectedYear]);

  // Organize days into 53 standard Sunday-Saturday columns (weeks of 7 days)
  // exactly matching GitHub's real contribution graph:
  // Row 0 = Sunday, Row 1 = Monday, ..., Row 5 = Friday, Row 6 = Saturday
  const { weeks, monthLabels } = useMemo(() => {
    const raw = data?.contributions || [];
    if (raw.length === 0) return { weeks: [], monthLabels: [] };

    // Sort chronologically ascending
    const sorted = [...raw].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const weeksArr: (ContributionDay | null)[][] = [];
    let currentWeek: (ContributionDay | null)[] = new Array(7).fill(null);

    sorted.forEach((day) => {
      const [year, month, dt] = day.date.split("-").map(Number);
      // getDay(): 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
      const dayOfWeek = new Date(year, month - 1, dt).getDay();

      currentWeek[dayOfWeek] = day;

      // On Saturday (day 6), close this week column and start a fresh one
      if (dayOfWeek === 6) {
        weeksArr.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
    });

    // If year doesn't end on a Saturday, push the final partial week
    if (currentWeek.some((d) => d !== null)) {
      weeksArr.push(currentWeek);
    }

    // Determine month label positions based on where the 1st of each month lands
    const labels: { name: string; colIndex: number }[] = [];
    let lastMonth = -1;

    weeksArr.forEach((wk, colIdx) => {
      const validDays = wk.filter((d): d is ContributionDay => d !== null);
      if (validDays.length > 0) {
        const firstOfMonth = validDays.find(
          (d) => Number(d.date.split("-")[2]) === 1
        );
        const m = firstOfMonth
          ? Number(firstOfMonth.date.split("-")[1]) - 1
          : Number(validDays[0].date.split("-")[1]) - 1;

        if (m !== lastMonth && colIdx < weeksArr.length - 2) {
          labels.push({ name: MONTH_NAMES[m], colIndex: colIdx });
          lastMonth = m;
        }
      }
    });

    return { weeks: weeksArr, monthLabels: labels };
  }, [data]);

  // Fallbacks accurately matched to Anit Kushwaha's real GitHub profile
  const displayedTotal =
    data?.totalContributions ?? (selectedYear === "2026" ? 587 : selectedYear === "2025" ? 574 : 1);
  const displayedCurrentStreak =
    data?.currentStreak ?? (selectedYear === "2026" ? 236 : 1);
  const displayedLongestStreak =
    data?.longestStreak ?? (selectedYear === "2026" ? 236 : 14);

  return (
    <section id="github" className="section-container relative w-full max-w-full scroll-mt-20 pt-16 sm:pt-24 pb-14 sm:pb-20 overflow-hidden">
      {/* Background radial accent glow matching signature palette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-red-600/10 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-5xl mx-auto space-y-6 sm:space-y-10"
      >
        {/* Section Header: Centered with Signature Red/Rose/Amber Gradient */}
        <div className="text-center space-y-2.5 sm:space-y-3 mb-6 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
            <FaGithub className="w-3.5 h-3.5" />
            <span>Open Source & Activity</span>
          </div>
          <h2 className="section-title mb-0 text-center break-words">
            GitHub Activity &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.35)]">
              Streak
            </span>
          </h2>
          <p className="text-xs sm:text-base text-gray-400 max-w-xl mx-auto px-2">
            Live commit history, continuous development streaks, and pinned repositories from{" "}
            <Link
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:underline font-medium"
            >
              @AnitKushwaha700
            </Link>
            .
          </p>
        </div>

        {/* 3 Metric Summary Cards — Compact, Proportionate & Harmonized */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 w-full">
          {/* Card 1: Total Contributions */}
          <div className="relative bg-[#0d121f]/90 border border-gray-800/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-3.5 shadow-xl hover:border-red-500/40 transition-colors w-full min-w-0">
            <div className="p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">
              <GitCommit className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-black text-white truncate">
                {displayedTotal}
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 font-medium truncate">
                Contributions in {selectedYear === "last" ? "the last year" : selectedYear}
              </p>
            </div>
          </div>

          {/* Card 2: Current Streak */}
          <div className="relative bg-[#0d121f]/90 border border-gray-800/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-3.5 shadow-xl hover:border-rose-500/40 transition-colors w-full min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5">
                <span>{displayedCurrentStreak}</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-400">Days</span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 font-medium truncate">Active Daily Streak</p>
            </div>
          </div>

          {/* Card 3: Longest Streak */}
          <div className="relative bg-[#0d121f]/90 border border-gray-800/90 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 sm:gap-3.5 shadow-xl hover:border-amber-500/40 transition-colors w-full min-w-0">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-black text-white flex items-center gap-1.5">
                <span>{displayedLongestStreak}</span>
                <span className="text-xs sm:text-sm font-semibold text-gray-400">Days</span>
              </div>
              <p className="text-[11px] sm:text-xs text-gray-400 font-medium truncate">Longest Recorded Streak</p>
            </div>
          </div>
        </div>

        {/* GitHub Heatmap Calendar Container */}
        <div className="bg-[#0b0f19] border border-gray-800/90 rounded-2xl p-3.5 sm:p-6 shadow-2xl relative w-full overflow-hidden">
          {/* Top Bar: Title + Year Selector Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 sm:pb-4 border-b border-gray-800/70 gap-3 sm:gap-4 w-full">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-gray-100 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
                <span>
                  {displayedTotal} contributions in{" "}
                  {selectedYear === "last" ? "the last year" : selectedYear}
                </span>
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                Activity synchronized directly with GitHub profile
              </p>
            </div>

            {/* Year Selector Buttons: Harmonized Red/Rose Gradient */}
            <div className="flex items-center gap-1 bg-[#111827] p-1 rounded-xl border border-gray-800 w-full sm:w-auto justify-center">
              {["2026", "2025", "2024"].map((year) => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`flex-1 sm:flex-none px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                    selectedYear === year
                      ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Swipe Hint */}
          <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] text-gray-400 my-2 select-none">
            <span className="animate-pulse">‹ Swipe horizontally to view full year activity ›</span>
          </div>

          {/* Heatmap Grid Viewport with Ref for Auto-Scroll to Right */}
          <div
            ref={heatmapScrollRef}
            className="relative w-full max-w-full mt-2 sm:mt-4 overflow-x-auto pb-3 sm:pb-4 scrollbar-thin scroll-smooth flex justify-start md:justify-center"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {loading ? (
              <div className="h-28 sm:h-32 flex items-center justify-center text-xs sm:text-sm text-gray-400 animate-pulse">
                Loading contribution graph...
              </div>
            ) : (
              <div className="w-max min-w-[700px] select-none py-1">
                {/* Month labels */}
                <div className="relative h-5 text-[11px] text-gray-400 ml-7 flex">
                  {monthLabels.map((lbl, i) => (
                    <span
                      key={i}
                      style={{
                        position: "absolute",
                        left: `${lbl.colIndex * 15}px`,
                      }}
                    >
                      {lbl.name}
                    </span>
                  ))}
                </div>

                {/* Day labels + Matrix */}
                <div className="flex gap-2">
                  {/* Exact pixel-aligned weekday labels: Mon = Row 1, Wed = Row 3, Fri = Row 5 */}
                  <div className="flex flex-col gap-[3px] select-none text-[10px] text-gray-500 font-medium">
                    <div className="w-5 h-[12px]" aria-hidden="true" />
                    <div className="w-5 h-[12px] flex items-center leading-none">
                      <span>Mon</span>
                    </div>
                    <div className="w-5 h-[12px]" aria-hidden="true" />
                    <div className="w-5 h-[12px] flex items-center leading-none">
                      <span>Wed</span>
                    </div>
                    <div className="w-5 h-[12px]" aria-hidden="true" />
                    <div className="w-5 h-[12px] flex items-center leading-none text-rose-400 font-semibold">
                      <span>Fri</span>
                    </div>
                    <div className="w-5 h-[12px]" aria-hidden="true" />
                  </div>

                  {/* 53 Columns Grid */}
                  <div className="flex gap-[3px]">
                    {weeks.map((wk, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-[3px]">
                        {wk.map((day, rowIdx) => {
                          if (!day) {
                            return (
                              <div
                                key={`empty-${colIdx}-${rowIdx}`}
                                className="w-[12px] h-[12px] opacity-0 pointer-events-none"
                              />
                            );
                          }

                          const bg = LEVEL_COLORS[day.level] || LEVEL_COLORS[0];
                          return (
                            <div
                              key={day.date}
                              onMouseEnter={(e) => handleDayInteraction(e, day)}
                              onMouseLeave={() => setHoveredDay(null)}
                              onClick={(e) => handleDayInteraction(e, day)}
                              className="w-[12px] h-[12px] rounded-[2.5px] transition-transform duration-150 hover:scale-125 active:scale-125 cursor-pointer"
                              style={{ backgroundColor: bg }}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Floating Tooltip with Formatted Weekday */}
            {hoveredDay && (
              <div
                className="fixed z-50 pointer-events-none -translate-x-1/2 -translate-y-full px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-700 text-white text-[11px] font-medium shadow-2xl whitespace-nowrap"
                style={{ left: hoveredDay.x, top: hoveredDay.y }}
              >
                <span className="font-bold text-red-400">
                  {hoveredDay.count} {hoveredDay.count === 1 ? "contribution" : "contributions"}
                </span>{" "}
                on {formatTooltipDate(hoveredDay.date)}
              </div>
            )}
          </div>

          {/* Bottom Bar: Help Link & Legend */}
          <div className="flex flex-col sm:flex-row items-center justify-between pt-3 sm:pt-3.5 border-t border-gray-800/60 text-[11px] sm:text-xs text-gray-400 gap-2 sm:gap-3">
            <Link
              href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-400 transition-colors text-center sm:text-left"
            >
              Learn how we count contributions
            </Link>

            <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-400">
              <span>Less</span>
              {[0, 1, 2, 3, 4].map((lvl) => (
                <div
                  key={lvl}
                  className="w-3 h-3 rounded-[2px]"
                  style={{ backgroundColor: LEVEL_COLORS[lvl] }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>

        {/* Pinned Repositories Grid */}
        <div className="space-y-3.5 sm:space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Pinned Repositories
              </h3>
            </div>
            <Link
              href={`${githubUrl}?tab=repositories`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-red-400 hover:text-red-300 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {PINNED_REPOS.map((repo) => (
              <Link
                key={repo.name}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-[#0d121f]/90 border border-gray-800/80 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.12)] transition-all duration-300 active:scale-[0.99]"
              >
                <div>
                  <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-gray-100 group-hover:text-red-400 transition-colors truncate min-w-0">
                      <BookMarked className="w-4 h-4 text-gray-400 group-hover:text-red-400 shrink-0" />
                      <span className="truncate">{repo.fullName || repo.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
                      {repo.tag && (
                        <span className="px-2 py-0.5 text-[10px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-full">
                          {repo.tag}
                        </span>
                      )}
                      <span className="px-2 py-0.5 text-[10px] font-medium text-gray-400 bg-gray-800/60 border border-gray-700/60 rounded-full">
                        Public
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-3">
                    {repo.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-400 pt-2.5 border-t border-gray-800/60">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: repo.languageColor }}
                    />
                    <span className="text-[11px] sm:text-xs">{repo.language}</span>
                  </div>

                  {(repo.stars !== undefined || repo.forks !== undefined) && (
                    <div className="flex items-center gap-3 text-[11px] sm:text-xs">
                      {repo.stars !== undefined && (
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400/20" />
                          <span>{repo.stars}</span>
                        </span>
                      )}
                      {repo.forks !== undefined && (
                        <span className="flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5 text-gray-400" />
                          <span>{repo.forks}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

import Link from "next/link";
import { User } from "lucide-react";

export default function Footer({ name }: { name?: string }) {
  const currentYear = new Date().getFullYear();
  const displayName = name || "Anit Kushwaha";

  return (
    <footer className="w-full bg-background border-t border-gray-800/50 py-5 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">
          © {currentYear} {displayName}. All rights reserved.
        </p>

        <div className="flex items-center gap-6">
          <Link
            href="/admin"
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label="Admin Portal"
            title="Admin"
          >
            <User className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

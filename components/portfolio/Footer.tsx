import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background border-t border-gray-800/50 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">
          © {currentYear} Anit Kushwaha. All rights reserved.
        </p>

        <div className="flex gap-6">
          <Link
            href="/admin"
            className="text-sm text-gray-500 hover:text-indigo-400 transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}

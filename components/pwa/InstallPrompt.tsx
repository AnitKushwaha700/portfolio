"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download } from "lucide-react";

export default function InstallPrompt() {
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // In development mode, unregister any active service workers and clear caches
    // to prevent dev server reload loops and HMR conflicts.
    if (process.env.NODE_ENV !== "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      });
      if ("caches" in window) {
        caches.keys().then((keys) => {
          for (const key of keys) {
            caches.delete(key);
          }
        });
      }
      return;
    }

    // Check if the app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsReadyForInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setIsReadyForInstall(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {isReadyForInstall && !isDismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 w-full z-[9999] p-4 pointer-events-none md:p-6"
        >
          <div className="max-w-md mx-auto bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 shadow-2xl shadow-black/50 pointer-events-auto flex items-center justify-between gap-4">
            <div className="flex flex-col">
              <h3 className="text-white font-semibold">Install App</h3>
              <p className="text-sm text-gray-400">
                Add to home screen for a better experience
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDismissed(true)}
                className="p-2 text-gray-400 hover:text-white rounded-full bg-gray-800/50 hover:bg-gray-800 transition-colors"
                aria-label="Dismiss install banner"
              >
                <X size={18} />
              </button>
              <button
                onClick={handleInstall}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-medium transition-all hover:scale-105 active:scale-95 text-sm"
              >
                <Download size={16} />
                Install
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

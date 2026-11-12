"use client";

import React, {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
} from "react";

export type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

const themeListeners = new Set<() => void>();

const subscribe = (callback: () => void) => {
  themeListeners.add(callback);
  const handleStorage = () => callback();
  window.addEventListener("storage", handleStorage);
  return () => {
    themeListeners.delete(callback);
    window.removeEventListener("storage", handleStorage);
  };
};

const notifyListeners = () => {
  themeListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // ignore
    }
  });
};

const getClientSnapshot = (): Theme => {
  if (typeof window === "undefined") return "dark";
  try {
    const saved = localStorage.getItem("portfolio-theme") as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
    if (document.documentElement.classList.contains("light")) return "light";
  } catch {
    // fallback
  }
  return "dark";
};

const getServerSnapshot = (): Theme => "dark";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const applyTheme = useCallback((newTheme: Theme) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    if (newTheme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
    try {
      localStorage.setItem("portfolio-theme", newTheme);
    } catch {
      // ignore
    }
    window.dispatchEvent(
      new CustomEvent("portfolio-theme-change", { detail: newTheme }),
    );
    notifyListeners();
  }, []);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      applyTheme(newTheme);
    },
    [applyTheme],
  );

  const toggleTheme = useCallback(() => {
    const current = getClientSnapshot();
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

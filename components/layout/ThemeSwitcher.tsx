import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export default function ThemeSwitcher() {
    const { theme, systemTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        queueMicrotask(() => setMounted(true));
    }, []);

    if (!mounted) return null;

    const currentTheme = theme === "system" ? systemTheme : theme;
    const isDark = currentTheme === "dark";
    const toggleTheme = () => setTheme(isDark ? "light" : "dark");

    const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleTheme();
        }
    };

    const trackStyle: React.CSSProperties = {
        background: isDark
            ? "linear-gradient(90deg, var(--background-800), var(--primary-700))"
            : "linear-gradient(90deg, var(--primary-100), var(--background-100))",
        boxShadow: isDark
            ? "inset 0 2px 10px rgba(0,0,0,0.45)"
            : "inset 0 1px 6px rgba(0,0,0,0.06)",
    };

    return (
        <button
            type="button"
            onClick={toggleTheme}
            onKeyDown={onKeyDown}
            aria-label="Cambiar tema"
            aria-pressed={isDark}
            className="relative inline-flex items-center w-16 h-8 rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-500)] transition-colors"
        >
            <div
                className="absolute inset-0 rounded-full transition-colors duration-300 ease-in-out"
                style={trackStyle}
            />

            <div className="absolute inset-0 flex items-center justify-between px-2 text-sm pointer-events-none select-none">
                <Sun
                    size={16}
                    className={`transition-opacity duration-300 ${
                        isDark ? "opacity-40 text-[var(--text-300)]" : "opacity-100 text-[var(--primary-600)]"
                    }`}
                />
                <Moon
                    size={16}
                    className={`transition-opacity duration-300 ${
                        isDark ? "opacity-100 text-[var(--background-200)]" : "opacity-40 text-[var(--text-400)]"
                    }`}
                />
            </div>

            <div
                className={`absolute top-0.5 left-0.5 w-7 h-7 rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                    isDark
                        ? "translate-x-8 bg-[var(--text)] text-[var(--background)]"
                        : "translate-x-0 bg-[var(--background)] text-[var(--primary-700)]"
                }`}
            >
                {isDark ? (
                    <Moon size={16} className="text-[var(--background)]" />
                ) : (
                    <Sun size={16} className="text-[var(--primary-700)]" />
                )}
            </div>
        </button>
    );
}

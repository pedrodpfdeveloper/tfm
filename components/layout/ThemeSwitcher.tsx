"use client";

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

    return (
        <button
            type="button"
            onClick={toggleTheme}
            onKeyDown={onKeyDown}
            aria-label="Cambiar tema"
            aria-pressed={isDark}
            className="relative inline-flex items-center w-16 h-8 rounded-full p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 transition-colors"
        >
            <div
                className={`absolute inset-0 rounded-full transition-colors duration-300 ease-in-out ${
                    isDark
                        ? "bg-gradient-to-r from-gray-800 to-gray-700"
                        : "bg-gradient-to-r from-yellow-100 to-white"
                }`}
            />

            <div className="absolute inset-0 flex items-center justify-between px-2 text-sm pointer-events-none select-none">
                <Sun
                    size={16}
                    className={`transition-opacity duration-300 ${
                        isDark ? "opacity-40" : "opacity-100 text-yellow-500"
                    }`}
                />
                <Moon
                    size={16}
                    className={`transition-opacity duration-300 ${
                        isDark ? "opacity-100 text-slate-300" : "opacity-40"
                    }`}
                />
            </div>

            <div
                className={`absolute top-0.5 left-0.5 w-7 h-7 rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
                    isDark
                        ? "translate-x-8 bg-gray-900 text-white"
                        : "translate-x-0 bg-white text-yellow-500"
                }`}
            >
                {isDark ? (
                    <Moon size={16} className="text-slate-200" />
                ) : (
                    <Sun size={16} className="text-yellow-500" />
                )}
            </div>
        </button>
    );
}

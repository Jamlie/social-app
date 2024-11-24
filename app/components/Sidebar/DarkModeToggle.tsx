"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const isDark =
            localStorage.getItem("darkMode") === "true" ||
            (!localStorage.getItem("darkMode") &&
                window.matchMedia("(prefers-color-scheme: dark)").matches);
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (darkMode) {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("darkMode", "false");
        } else {
            document.documentElement.classList.add("dark");
            localStorage.setItem("darkMode", "true");
        }
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle dark mode"
        >
            {darkMode ? (
                <>
                    <Sun />
                    <span className="ml-4">Light mode</span>
                </>
            ) : (
                <>
                    <Moon />
                    <span className="ml-4">Dark mode</span>
                </>
            )}
        </button>
    );
}

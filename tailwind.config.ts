import type { Config } from "tailwindcss";
import daisyui from "daisyui";
import aspectRatio from "@tailwindcss/aspect-ratio";
import plugin from "tailwindcss/plugin";

export default {
    darkMode: "class",
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
        },
    },
    plugins: [
        daisyui,
        aspectRatio,
        plugin(function ({ addComponents }) {
            addComponents({
                ".sidebar-link": {
                    "@apply flex items-center px-4 py-3 text-xl text-gray-900 dark:text-white rounded-full hover:bg-gray-100 dark:hover:bg-background":
                        {},
                },
                ".auth-link": {
                    "@apply w-full pl-10 pr-4 py-2 bg-white dark:bg-foreground border dark:border-gray-500 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:dark:ring-blue-600 focus:bg-white":
                        {},
                },
            });
        }),
    ],
    // daisyui: {
    //     themes: ["light", "dark"],
    // },
} satisfies Config;

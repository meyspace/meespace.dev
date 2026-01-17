import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class", // Important: Enforce class-based dark mode for next-themes
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                "text-muted": "#658174",
                "sage-green": "#8BA899", // Adjusted slightly per request if needed, or keep #8AA899. User provided #8BA899 in HTML.
                "sage-light": "#E8F0EB",
                "sage-dark": "#6B8E7D",
                // Map other custom vars if needed, though globals.css handles most
            },
            fontFamily: {
                "display": ["var(--font-inter)", "sans-serif"],
                "sans": ["var(--font-inter)", "sans-serif"],
            },
            borderRadius: {
                "lg": "1rem",
                "xl": "1.5rem",
                "2xl": "2rem",
                "card": "24px",
                "full": "9999px"
            },
        },
    },
    plugins: [],
};
export default config;

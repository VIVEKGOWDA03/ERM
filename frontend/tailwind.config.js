/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,mdx}", // Ensure Tailwind scans the necessary files
  ],
  important: true,
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 1.5s infinite",
      },
      backgroundImage: {
        "custom-gradient": "linear-gradient(to right, #F3F6D5, #DAF8E3)",
        "custom-gradient-2": "linear-gradient(to right, #E2E8F0, #A683C9)",
      },
      screens: {
        xs: {
          min: "325px",
          max: "639px",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        rubikVinyl: ['"Rubik Vinyl"', "cursive"],
        cairoPlay: ['"Cairo Play"', "sans-serif"],
        sixtyfour: ['"Sixtyfour"', "cursive"],
      },

      backdropBlur: {
        xs: "2px",
        huge: "50px",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        rippling: {
          "0%": {
            opacity: "1",
          },
          "100%": {
            transform: "scale(2)",
            opacity: "0",
          },
        },
        "shimmer-slide": {
          to: {
            transform: "translate(calc(100cqw - 100%), 0)",
          },
        },
        "spin-around": {
          "0%": {
            transform: "translateZ(0) rotate(0)",
          },
          "15%, 35%": {
            transform: "translateZ(0) rotate(90deg)",
          },
          "65%, 85%": {
            transform: "translateZ(0) rotate(270deg)",
          },
          "100%": {
            transform: "translateZ(0) rotate(360deg)",
          },
        },
        grid: {
          "0%": {
            transform: "translateY(-50%)",
          },
          "100%": {
            transform: "translateY(0)",
          },
        },
        spotlight: {
          "0%": {
            opacity: 0,
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%, -40%) scale(1)",
          },
        },
      },
      animation: {
        rippling: "rippling var(--duration) ease-out",
        "shimmer-slide":
          "shimmer-slide var(--speed) ease-in-out infinite alternate",
        "spin-around": "spin-around calc(var(--speed) * 2) infinite linear",
        grid: "grid 15s linear infinite",
        spotlight: "spotlight 2s ease .75s 1 forwards",
      },
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        danger: "#e3342f",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    // Add custom components (like buttons) here
    function ({ addComponents }) {
      addComponents({
        ".btn": {
          "@apply px-4 py-2 bg-primary font-semibold font-bold rounded-lg shadow-md focus:outline-none focus:ring-2":
            "",
        },
        ".btn-primary": {
          "@apply bg-primary rounded p-3 text-white font-bold hover:bg-blue-600 focus:ring-primary":
            "", // Apply valid focus:ring class
        },
        ".btn-secondary": {
          "@apply bg-secondary text-white font-bold hover:bg-gray-600 focus:ring-secondary":
            "", // Apply valid focus:ring class
        },
        ".btn-danger": {
          "@apply bg-danger p-2 border-[red] text-white font-bold hover:bg-red-600 focus:ring-danger":
            "", // Apply valid focus:ring class
        },
      });
    },
    require("tailwindcss-animate"),
  ],
};

import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Cores específicas para os temas de níveis
        bronze: {
          50: "#FCF8F3",
          100: "#F8EBD9",
          200: "#F1D7B0",
          300: "#E9C287",
          400: "#E2AE5E",
          500: "#D99A35", // Bronze principal
          600: "#B37B28",
          700: "#8D5C1E",
          800: "#673E14",
          900: "#41200A",
        },
        silver: {
          50: "#F7F9FA",
          100: "#E3E8ED",
          200: "#C7D2DB",
          300: "#ABBCC9",
          400: "#8FA6B7",
          500: "#7390A5", // Prata principal
          600: "#5C7A8F",
          700: "#465F70",
          800: "#304352",
          900: "#1A2833",
        },
        gold: {
          50: "#FFF8E6",
          100: "#FEEFC3",
          200: "#FDE29C",
          300: "#FBD174",
          400: "#FAC457",
          500: "#F8B73A", // Dourado principal
          600: "#F7A70D",
          700: "#D18C02",
          800: "#9F6A02",
          900: "#6D4801",
        },
        diamond: {
          50: "#F0FBFF",
          100: "#D6F2FF",
          200: "#ADE5FF",
          300: "#84D8FF",
          400: "#5BCBFF",
          500: "#32BEFF", // Diamante principal
          600: "#0099E6",
          700: "#0077B3",
          800: "#005580",
          900: "#00334D",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      boxShadow: {
        premium: "0 10px 25px -5px rgba(var(--primary), 0.1), 0 8px 10px -6px rgba(var(--primary), 0.05)",
        "premium-hover": "0 15px 30px -5px rgba(var(--primary), 0.15), 0 10px 15px -6px rgba(var(--primary), 0.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

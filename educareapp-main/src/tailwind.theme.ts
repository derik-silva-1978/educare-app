
import { type Config } from 'tailwindcss';

export const theme: Config['theme'] = {
  extend: {
    colors: {
      border: "hsl(var(--border))",
      input: "hsl(var(--input))",
      ring: "hsl(var(--ring))",
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: {
        DEFAULT: "#91D8F7", // Light Blue as primary
        dark: "#52658C", // Navy Blue as dark primary
        50: "#F0F9FF",
        100: "#E0F7FF",
        200: "#BAE6FD",
        300: "#91D8F7", // Light Blue
        400: "#5BC2F0",
        500: "#38BDF8",
        600: "#52658C", // Navy Blue
        700: "#0369A1",
        800: "#075985",
        900: "#0C4A6E",
        950: "#082F49",
      },
      secondary: {
        DEFAULT: "#F9B8B5", // Light Pink as secondary
        foreground: "#222222", // Darker text color on secondary for better contrast
        50: "#FFF1F0",
        100: "#FFE2E0",
        200: "#FEC6C3",
        300: "#F9B8B5", // Light Pink
        400: "#F48B85",
        500: "#EF4D65", // Coral Red
        600: "#E1342A",
        700: "#BB271F",
        800: "#99231C",
        900: "#7E221D",
        950: "#440E0A",
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
        DEFAULT: "#EF4D65", // Coral Red as accent
        foreground: "#FFFFFF", // White text for better contrast
      },
      popover: {
        DEFAULT: "hsl(var(--popover))",
        foreground: "hsl(var(--popover-foreground))",
      },
      card: {
        DEFAULT: "hsl(var(--card))",
        foreground: "hsl(var(--card-foreground))",
      },
      educare: {
        pink: "#F9B8B5", // Light Pink
        red: "#EF4D65", // Coral Red
        blue: "#91D8F7", // Light Blue
        navy: "#1A1F2C", // Darker Navy Blue for better contrast
        50: "#F4F1FA",
        100: "#E5DEFF",
        200: "#D6BCFA",
        300: "#B794F4",
        400: "#9B87F5",
        500: "#805AD5",
        600: "#6E59A5",
        700: "#553C9A",
        800: "#44337A",
        900: "#322659",
        950: "#1A1A2E",
      },
      // Admin-specific colors for improved contrast
      admin: {
        background: "#FFFFFF",
        foreground: "#121212", // Very dark text for strong contrast
        card: "#F8FAFC",
        cardBorder: "#E2E8F0",
        tableHeader: "#F1F5F9",
        tableBorder: "#E2E8F0",
        tableHover: "#F1F5F9",
        input: "#FFFFFF",
        inputBorder: "#CBD5E1",
        button: "#1E40AF",
        buttonText: "#FFFFFF",
      }
    },
    borderRadius: {
      lg: "var(--radius)",
      md: "calc(var(--radius) - 2px)",
      sm: "calc(var(--radius) - 4px)",
    },
    keyframes: {
      "accordion-down": {
        from: { height: '0' },
        to: { height: "var(--radix-accordion-content-height)" },
      },
      "accordion-up": {
        from: { height: "var(--radix-accordion-content-height)" },
        to: { height: '0' },
      },
      "float": {
        "0%, 100%": { transform: "translateY(0)" },
        "50%": { transform: "translateY(-10px)" },
      },
      "pulse-soft": {
        "0%, 100%": { opacity: "1" },
        "50%": { opacity: "0.7" },
      },
    },
    animation: {
      "accordion-down": "accordion-down 0.2s ease-out",
      "accordion-up": "accordion-up 0.2s ease-out",
      "float": "float 6s ease-in-out infinite",
      "pulse-soft": "pulse-soft 3s ease-in-out infinite",
    },
  },
};

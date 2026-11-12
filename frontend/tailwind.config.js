/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Academic Sanctuary Color Tokens
        "primary": "#002043",
        "on-primary": "#ffffff",
        "primary-container": "#17365d",
        "on-primary-container": "#84a0cd",
        "primary-fixed": "#d5e3ff",
        "primary-fixed-dim": "#acc8f7",
        "on-primary-fixed": "#001c3b",
        "on-primary-fixed-variant": "#2b486f",
        "inverse-primary": "#acc8f7",

        "secondary": "#0051d5",
        "on-secondary": "#ffffff",
        "secondary-container": "#316bf3",
        "on-secondary-container": "#fefcff",
        "secondary-fixed": "#dbe1ff",
        "secondary-fixed-dim": "#b4c5ff",
        "on-secondary-fixed": "#00174b",
        "on-secondary-fixed-variant": "#003ea8",

        "tertiary": "#00270c",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#003f18",
        "on-tertiary-container": "#00b753",
        "tertiary-fixed": "#6bff8f",
        "tertiary-fixed-dim": "#4ae176",
        "on-tertiary-fixed": "#002109",
        "on-tertiary-fixed-variant": "#005321",

        "error": "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        "surface": "#f8f9ff",
        "on-surface": "#0b1c30",
        "surface-variant": "#d3e4fe",
        "on-surface-variant": "#43474e",
        "surface-dim": "#cbdbf5",
        "surface-bright": "#f8f9ff",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#eff4ff",
        "surface-container": "#e5eeff",
        "surface-container-high": "#dce9ff",
        "surface-container-highest": "#d3e4fe",
        "inverse-surface": "#213145",
        "inverse-on-surface": "#eaf1ff",
        "surface-tint": "#435f89",

        "outline": "#74777f",
        "outline-variant": "#c4c6cf",
        "background": "#f8f9ff",
        "on-background": "#0b1c30",

        // Functional Status Colors
        "status-available": "#22c55e",
        "status-occupied": "#ef4444",
        "status-reserved": "#3b82f6",
        "status-offline": "#94a3b8",
      },
      borderRadius: {
        "DEFAULT": "0.25rem", // 4px
        "lg": "0.5rem",       // 8px
        "xl": "0.75rem",      // 12px
        "2xl": "1rem",        // 16px
        "full": "9999px",
      },
      spacing: {
        "space-xs": "0.25rem", // 4px
        "space-sm": "0.5rem",  // 8px
        "space-md": "1rem",    // 16px
        "space-lg": "1.5rem",  // 24px
        "space-xl": "2.5rem",  // 40px
        "gutter": "1.5rem",
        "gutter-mobile": "1rem",
        "margin": "2rem",
        "margin-mobile": "1rem",
      },
      fontFamily: {
        "headline-lg": ["'Plus Jakarta Sans'", "sans-serif"],
        "headline-md": ["'Plus Jakarta Sans'", "sans-serif"],
        "headline-sm": ["'Plus Jakarta Sans'", "sans-serif"],
        "display-lg": ["'Plus Jakarta Sans'", "sans-serif"],
        "display-lg-mobile": ["'Plus Jakarta Sans'", "sans-serif"],
        "title-md": ["'Inter'", "sans-serif"],
        "body-lg": ["'Inter'", "sans-serif"],
        "body-md": ["'Inter'", "sans-serif"],
        "body-sm": ["'Inter'", "sans-serif"],
        "label-md": ["'Inter'", "sans-serif"],
        "label-sm": ["'Inter'", "sans-serif"],
        "tabular-numeric": ["'Inter'", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["30px", { lineHeight: "38px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-lg": ["28px", { lineHeight: "36px", letterSpacing: "-0.015em", fontWeight: "700" }],
        "headline-md": ["22px", { lineHeight: "30px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "headline-sm": ["18px", { lineHeight: "26px", letterSpacing: "-0.005em", fontWeight: "600" }],
        "title-md": ["16px", { lineHeight: "24px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }],
        "body-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "label-md": ["13px", { lineHeight: "18px", fontWeight: "500" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.04em", fontWeight: "600" }],
        "tabular-numeric": ["13px", { lineHeight: "18px", fontWeight: "600" }],
      },
    },
  },
  plugins: [],
};


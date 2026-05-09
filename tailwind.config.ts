import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        fg: "var(--color-fg)",
        card: "var(--color-card)",
        primary: "var(--color-primary)",
        muted: "var(--color-muted)",
        "muted-fg": "var(--color-muted-fg)",
        border: "var(--color-border)",
        success: "var(--color-success)",
        destructive: "var(--color-destructive)",
        accent: "var(--color-accent)",
      },
      maxWidth: {
        page: "1600px",
      },
    },
  },
  plugins: [],
} satisfies Config;
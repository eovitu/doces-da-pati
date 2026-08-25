// placeholder — trocar quando o briefing de identidade visual voltar
// (cores da marca, fontes, tom visual da loja ainda não definidos)
export const theme = {
  colors: {
    background: "#faf9f7",
    surface: "#ffffff",
    border: "#e7e2dc",
    textPrimary: "#1c1917",
    textSecondary: "#57534e",
    textMuted: "#78716c",
    accent: "#059669",
    accentHover: "#047857",
    disabled: "#d6d3d1",
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2.5rem",
    xxl: "4rem",
  },
  radii: {
    sm: "0.5rem",
    md: "0.75rem",
    lg: "1rem",
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    fontMono: "var(--font-geist-mono), monospace",
  },
  // mobile-first: usar sempre com min-width
  breakpoints: {
    tablet: "768px",
    desktop: "1024px",
    desktopLarge: "1440px",
  },
} as const;

export type Theme = typeof theme;

export const media = {
  tablet: `@media (min-width: ${theme.breakpoints.tablet})`,
  desktop: `@media (min-width: ${theme.breakpoints.desktop})`,
  desktopLarge: `@media (min-width: ${theme.breakpoints.desktopLarge})`,
};

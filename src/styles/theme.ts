// Identidade visual da Os Doces da Pati.
//
// As 8 fotos de produto foram feitas no mesmo cenário (mármore branco, parede
// off-white quente, luz da esquerda). A amostragem das bordas das 8 imagens dá
// uma média de #e7e5df, com variação entre tons quentes (#f1ede7) e mais frios
// (#eef1f0). O fundo da página e o "papel" onde as fotos assentam saem daí:
// próximos o bastante para a foto não parecer colada, tolerantes o bastante
// para a variação entre elas não aparecer como emenda.
//
// Contraste (WCAG 2.1, calculado — não estimado):
//   ink       #2E1E1A sobre background  14.96:1
//   ink       #2E1E1A sobre paper       13.69:1
//   inkSoft   #6B5147 sobre background   6.81:1
//   inkMuted  #7A6258 sobre background   5.30:1
//   accent    #B0175A sobre background   6.32:1
//   #FFFFFF   sobre accent               6.74:1
//   #FFFFFF   sobre accentHover          9.02:1
//   ink       sobre accentSoft          13.38:1
export const theme = {
  colors: {
    background: "#FBF7F3", // off-white quente — nunca #ffffff puro
    paper: "#F2EDE6", // base das fotos, meio-tom entre o fundo da página e o das imagens
    ink: "#2E1E1A", // marrom bem escuro no lugar do preto
    inkSoft: "#6B5147",
    inkMuted: "#7A6258",
    accent: "#B0175A", // rosa da marca, fechado o suficiente para texto branco
    accentHover: "#8E1247",
    accentSoft: "#F7E7EE", // rosa claro — só como fundo, nunca como texto
    line: "#E2D9D0",
    disabled: "#D9CFC7",
  },
  spacing: {
    xxs: "0.25rem",
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1.25rem",
    lg: "2rem",
    xl: "3.5rem",
    xxl: "6rem",
    xxxl: "9rem",
  },
  radii: {
    sm: "0.25rem",
    md: "0.5rem",
    pill: "999px",
  },
  // escala tipográfica — mobile / desktop, via clamp
  fontSize: {
    micro: "clamp(0.75rem, 0.72rem + 0.15vw, 0.8125rem)",
    small: "clamp(0.875rem, 0.85rem + 0.15vw, 0.9375rem)",
    body: "clamp(1rem, 0.97rem + 0.2vw, 1.0625rem)",
    lead: "clamp(1.0625rem, 1rem + 0.5vw, 1.25rem)",
    produto: "clamp(1.375rem, 1.15rem + 1vw, 2rem)",
    secao: "clamp(1.5rem, 1.2rem + 1.4vw, 2.25rem)",
    display: "clamp(2.5rem, 1.6rem + 4.4vw, 5.5rem)",
  },
  typography: {
    display: "var(--font-fraunces), Georgia, 'Times New Roman', serif",
    body: "var(--font-karla), system-ui, -apple-system, sans-serif",
  },
  maxWidth: "1320px",
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
  reducedMotion: "@media (prefers-reduced-motion: reduce)",
};

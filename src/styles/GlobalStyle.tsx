"use client";

import { createGlobalStyle } from "styled-components";
import { theme, media } from "./theme";

export const GlobalStyle = createGlobalStyle`
  html {
    scroll-behavior: auto;
  }

  body {
    background: ${theme.colors.background};
    color: ${theme.colors.ink};
    font-family: ${theme.typography.body};
    font-size: ${theme.fontSize.body};
    line-height: 1.6;
    text-rendering: optimizeLegibility;
  }

  h1, h2, h3 {
    font-family: ${theme.typography.display};
    font-weight: 400;
    line-height: 1.05;
    text-wrap: balance;
  }

  p {
    text-wrap: pretty;
  }

  ::selection {
    background: ${theme.colors.accentSoft};
    color: ${theme.colors.ink};
  }

  :focus-visible {
    outline: 2px solid ${theme.colors.accent};
    outline-offset: 3px;
    border-radius: ${theme.radii.sm};
  }

  ${media.reducedMotion} {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

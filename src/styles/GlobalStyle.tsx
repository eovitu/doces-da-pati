"use client";

import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

export const GlobalStyle = createGlobalStyle`
  body {
    background: ${theme.colors.background};
    color: ${theme.colors.textPrimary};
    font-family: ${theme.typography.fontFamily};
  }
`;

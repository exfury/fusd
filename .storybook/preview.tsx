import type { Preview } from "@storybook/react";

import React from 'react';
import {
  globalStyle,
  GlobalStyle,
} from '../src/@libs/neumorphism-ui/themes/GlobalStyle';
import { ThemeProvider } from '../src/@libs/neumorphism-ui/themes/ThemeProvider';
import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';
import { darkTheme } from '../src/themes/terra';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    theme,
  },
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: '#1f2237',
      },
      {
        name: 'light',
        value: '#f4f4f5',
      },
    ],
  },
};

export const decorators = [
  (Story, { globals }) => (
    <ThemeProvider
      theme={darkTheme}

    >
      <GlobalStyle />
      <DocGlobalStyle />
      <Story />
    </ThemeProvider>
  ),
];

export const DocGlobalStyle = createGlobalStyle`
  .docs-story {
    background-color: ${({ theme }) => "#1f2237"};
  }
`;
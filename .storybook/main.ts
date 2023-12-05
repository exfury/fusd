import type { StorybookConfig } from "@storybook/react-vite";
import { TransformOptions } from '@babel/core';
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/preset-create-react-app",
    "@storybook/addon-onboarding",
    "@storybook/addon-interactions",
    "@storybook/addon-themes"
  ],
  core: {
    builder: '@storybook/builder-vite', // 👈 The builder enabled here.
  },
  framework: {
    name: "@storybook/react-vite",
    options: {
      builder: {},
    },
  },
  docs: {
    autodocs: "tag",
  },
  staticDirs: ["../public"],
  async viteFinal(config, { configType }) {
    return mergeConfig(config, {
        define: {
            'process.env.NODE_DEBUG': false,
        }
    });
},
};


export default config;

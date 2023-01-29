import type { StorybookViteConfig } from '@storybook/builder-vite';
import { dirname } from 'path';

export default {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-controls'],
  core: {
    builder: '@storybook/builder-vite',
  },
  refs: {
    '@chakra-ui/react': { disable: true },
    '@mui/material': { disable: true },
  },
  features: {
    emotionAlias: false,
    storyStoreV7: true,
  },
  framework: '@storybook/react',

  // @FIXME: remove after switch to storybook v7
  // https://github.com/eirslett/storybook-builder-vite/issues/55
  async viteFinal(config) {
    config.root = dirname(require.resolve('storybook-builder-vite'));
    return config;
  },
} as StorybookViteConfig;

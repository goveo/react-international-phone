export default {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-controls', '@storybook/preset-scss'],
  refs: {
    '@chakra-ui/react': { disable: true },
    '@mui/material': { disable: true },
  },
  features: {
    emotionAlias: false,
    storyStoreV7: true,
  },
  framework: '@storybook/react-vite',
  staticDirs: ['./static'],
};

export default {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-controls', '@storybook/preset-scss'],
  core: {
    builder: '@storybook/builder-webpack5',
  },
};

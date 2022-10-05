module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-knobs', '@storybook/preset-scss'],
  core: {
    builder: '@storybook/builder-webpack5',
  },
};

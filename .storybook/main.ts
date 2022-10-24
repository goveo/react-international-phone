export const stories = [
  '../src/**/*.stories.mdx',
  '../src/**/*.stories.@(js|jsx|ts|tsx)',
];
export const addons = ['@storybook/addon-controls', '@storybook/preset-scss'];
export const core = {
  builder: '@storybook/builder-webpack5',
};

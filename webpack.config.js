/* eslint-disable no-undef */
const path = require('path');

const getPath = (...pathArray) => {
  return path.join(__dirname, ...pathArray);
};

module.exports = {
  mode: 'production',
  entry: {
    PhoneInput: {
      import: getPath('src', 'components', 'PhoneInput', 'PhoneInput.tsx'),
      dependOn: ['usePhoneInput'],
    },
    usePhoneInput: {
      import: getPath('src', 'hooks', 'usePhoneInput.ts'),
      dependOn: ['usePhone'],
    },
    usePhone: {
      import: getPath('src', 'hooks', 'usePhone.ts'),
      dependOn: ['formatPhone'],
    },
    formatPhone: getPath('src', 'utils', 'phoneUtils', 'formatPhone.ts'),
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: ['/node_modules/'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.css$/,
        use: {
          loader: 'css-loader',
          options: {
            modules: true,
          },
        },
      },
    ],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
  },
};

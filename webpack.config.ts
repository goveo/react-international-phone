import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import type { Configuration } from 'webpack';

export default <Configuration>{
  mode: 'production',
  entry: {
    index: path.join(__dirname, 'src', 'index.ts'),
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
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
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build'),
    clean: true,
    libraryTarget: 'umd',
    library: 'react-international-phone',
  },
  externals: {
    react: 'react',
  },
};

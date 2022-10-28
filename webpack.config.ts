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
    libraryTarget: 'umd',
    library: 'react-international-phone',
  },
  externals: {
    react: 'react',
  },
};

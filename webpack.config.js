const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, './src');
const DIST_DIR = path.resolve(__dirname, './dist');

const baseConfig = {
  devtool: 'source-map',
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      ':server': path.join(SRC_DIR, './server'),
      ':web': path.join(SRC_DIR, './web'),
      ':storybook': path.join(SRC_DIR, './storybook'),
      ':__generated__': path.join(SRC_DIR, './__generated__')
    }
  },
  plugins: [new webpack.ProgressPlugin()]
};

const webConfig = {
  ...baseConfig,

  entry: './src/web/index.tsx',
  target: 'web',
  output: {
    filename: 'web.js',
    path: path.join(DIST_DIR, 'web')
  },
  plugins: [
    ...baseConfig.plugins,
    new CopyPlugin([
      {
        from: path.join(__dirname, './icon.png'),
        to: path.join(DIST_DIR, 'web')
      }
    ])
  ]
};

const ssrConfig = {
  ...baseConfig,

  entry: './src/web/index.tsx',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: 'ssr.js',
    path: path.join(DIST_DIR),
    library: 'Bootstrap',
    libraryExport: 'default',
    libraryTarget: 'commonjs'
  }
};

module.exports = [webConfig, ssrConfig];

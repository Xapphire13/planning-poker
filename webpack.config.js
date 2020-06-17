const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const SRC_DIR = path.resolve(__dirname, './src');
const DIST_DIR = path.resolve(__dirname, './dist');

const baseConfig = {
  devtool: 'source-map',
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
          {
            loader: 'linaria/loader',
            options: {
              sourceMap: process.env.NODE_ENV !== 'production'
            }
          }
        ]
      },
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

const webConfig = merge(baseConfig, {
  entry: './src/web/index.tsx',
  target: 'web',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV !== 'production'
            }
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: process.env.NODE_ENV !== 'production'
            }
          }
        ]
      }
    ]
  },
  output: {
    filename: 'web.js',
    path: path.join(DIST_DIR, 'web')
  },
  plugins: [
    ...baseConfig.plugins,
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.join(__dirname, './icon.png'),
          to: path.join(DIST_DIR, 'web')
        }
      ]
    })
  ]
});

const ssrConfig = merge(baseConfig, {
  entry: './src/web/index.tsx',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'null-loader'
      }
    ]
  },
  externals: [nodeExternals()],
  output: {
    filename: 'ssr.js',
    path: path.join(DIST_DIR),
    library: 'Bootstrap',
    libraryExport: 'default',
    libraryTarget: 'commonjs'
  }
});

module.exports = [webConfig, ssrConfig];

const path = require("path");
const webpack = require('webpack');
const nodeExternals = require("webpack-node-externals");
const CopyPlugin = require('copy-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, "./src");
const DIST_DIR = path.resolve(__dirname, "./dist");

const baseConfig = {
  devtool: "source-map",
  mode: process.env.NODE_ENV || "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      ":client": path.join(SRC_DIR, "./client"),
      ":shared": path.join(SRC_DIR, "./shared"),
      ":server": path.join(SRC_DIR, "./server"),
      ":web": path.join(SRC_DIR, "./web"),
      ":storybook": path.join(SRC_DIR, "./storybook")
    }
  },
  plugins: [new webpack.ProgressPlugin()],
}

const clientConfig = {
  ...baseConfig,

  entry: "./src/client/index.tsx",
  target: "electron-renderer",
  output: {
    filename: 'client.js',
    path: DIST_DIR,
  },
  plugins: [
    ...baseConfig.plugins,
    new CopyPlugin([
      {
        from: path.join(SRC_DIR, "./client/index.html"),
        to: DIST_DIR
      }
    ])
  ]
};

const webConfig = {
  ...baseConfig,

  entry: "./src/web/index.tsx",
  target: "web",
  output: {
    filename: 'web.js',
    path: path.join(DIST_DIR, './web'),
  },
  plugins: [
    ...baseConfig.plugins
  ]
}

const serverConfig = {
  ...baseConfig,

  entry: {
    server: "./src/server/index.tsx",
    "ssr-web": "./src/web/index.tsx"
  },
  target: "electron-main",
  output: {
    filename: '[name].js',
    path: DIST_DIR
  },
  externals: [nodeExternals()],
  node: {
    __dirname: false
  }
}

module.exports = [clientConfig, serverConfig, webConfig];
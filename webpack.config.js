const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require("webpack-node-externals");

const baseConfig = {
  devtool: "source-map",
  mode: "development",
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
      ":client": path.resolve(__dirname, "./src/client"),
      ":shared": path.resolve(__dirname, "./src/shared"),
      ":server": path.resolve(__dirname, "./src/server"),
      ":web": path.resolve(__dirname, "./src/web")
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
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    ...baseConfig.plugins,
    new HtmlWebpackPlugin()
  ]
};

const webConfig = {
  ...baseConfig,

  entry: "./src/web/index.tsx",
  target: "web",
  output: {
    filename: 'web.js',
    path: path.resolve(__dirname, 'dist/web'),
  },
  plugins: [
    ...baseConfig.plugins,
    new HtmlWebpackPlugin({
      title: "Planning Poker"
    })
  ]
}

const serverConfig = {
  ...baseConfig,

  entry: "./src/server/index.ts",
  target: "electron-main",
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()],
  node: {
    __dirname: false
  }
}

module.exports = [clientConfig, serverConfig, webConfig];
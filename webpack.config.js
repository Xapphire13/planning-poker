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
      ":server": path.resolve(__dirname, "./src/server")
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
    publicPath: "./"
  },
  plugins: [
    ...baseConfig.plugins,
    new HtmlWebpackPlugin()
  ]
};

const serverConfig = {
  ...baseConfig,

  entry: "./src/server/index.ts",
  target: "electron-main",
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  },
  externals: [nodeExternals()]
}

module.exports = [clientConfig, serverConfig];
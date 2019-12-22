const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseConfig = {
  devtool: "source-map",
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
  },
  plugins: [new webpack.ProgressPlugin()],
}

const clientConfig = {
  ...baseConfig,

  entry: "./src/client/index.ts",
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
}

module.exports = [clientConfig, serverConfig];
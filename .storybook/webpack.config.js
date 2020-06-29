const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");

module.exports = ({ config }) => merge(config, {
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
    alias: {
      ":shared": path.resolve(__dirname, "../src/shared"),
      ":server": path.resolve(__dirname, "../src/server"),
      ":web": path.resolve(__dirname, "../src/web"),
      ":storybook": path.resolve(__dirname, "../src/storybook"),
      ":__generated__": path.resolve(__dirname, "../src/__generated__")
    },
    extensions: [".ts", ".tsx"],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new (require("rewiremock/webpack/plugin"))()
  ]
});
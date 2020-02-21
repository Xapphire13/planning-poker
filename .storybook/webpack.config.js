const path = require("path");

module.exports = ({ config }) => {
  config.module.rules = [{
    test: /\.(ts|tsx)$/,
    use: [
      {
        loader: "ts-loader",
      },
    ],
  }];

  config.resolve.alias = {
    ":shared": path.resolve(__dirname, "../src/shared"),
    ":server": path.resolve(__dirname, "../src/server"),
    ":web": path.resolve(__dirname, "../src/web"),
    ":storybook": path.resolve(__dirname, "../src/storybook"),
    ":__generated__": path.resolve(__dirname, "../src/__generated__")
  }

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
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
    ":client": path.resolve(__dirname, "../src/client"),
    ":shared": path.resolve(__dirname, "../src/shared"),
    ":server": path.resolve(__dirname, "../src/server"),
    ":web": path.resolve(__dirname, "../src/web"),
    ":storybook": path.resolve(__dirname, "../src/storybook")
  }

  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};
const { createBabelOptions } = require("../transform");

const createBaseConfig = require("./base");

function karma(config) {
  const babelOptions = createBabelOptions({
    coverage: false,
    modules: false,
    types: false,
    useBuiltIns: true
  });
  const baseConfig = createBaseConfig(babelOptions);

  baseConfig.plugins.push(
    "karma-chrome-launcher",
    "karma-firefox-launcher",
    "karma-safari-launcher"
  );

  config.set(baseConfig);
}

module.exports = karma;

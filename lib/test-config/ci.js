const { name } = require("../pkg");
const { createBabelOptions } = require("../transform");

const createBaseConfig = require("./base");
const browsers = require("./browsers");

function getBuild() {
  let id = `${name.toUpperCase()} - TRAVIS #${process.env.TRAVIS_BUILD_NUMBER}`;

  id += ` (Branch: ${process.env.TRAVIS_BRANCH}`;

  if (process.env.TRAVIS_PULL_REQUEST !== "false") {
    id += ` | PR: ${process.env.TRAVIS_PULL_REQUEST}`;
  }

  id += ")";

  return id;
}

function getTunnel() {
  return process.env.TRAVIS_JOB_NUMBER;
}

function karma(config) {
  const babelOptions = createBabelOptions({
    coverage: true,
    modules: false,
    types: false
  });
  const baseConfig = createBaseConfig(babelOptions);

  baseConfig.plugins.push(
    "karma-sauce-launcher",
    "karma-coverage",
    "karma-coveralls"
  );

  baseConfig.reporters = ["dots", "coverage", "coveralls", "saucelabs"];

  baseConfig.coverageReporter = {
    dir: "./coverage",
    reporters: [{ type: "text" }, { type: "lcov" }]
  };

  baseConfig.sauceLabs = {
    testName: name,
    build: getBuild(),
    tunnelIdentifier: getTunnel(),
    recordVideo: false,
    recordScreenshots: false,
    startConnect: false,
    commandTimeout: 600,
    idleTimeout: 360,
    maxDuration: 3600
  };

  baseConfig.customLaunchers = browsers;
  baseConfig.browsers = Object.keys(browsers);

  baseConfig.concurrency = 1;
  baseConfig.browserDisconnectTimeout = 10000;
  baseConfig.browserDisconnectTolerance = 3;
  baseConfig.browserNoActivityTimeout = 4 * 60 * 1000;
  baseConfig.captureTimeout = 60000;
  baseConfig.retryLimit = 3;

  config.set(baseConfig);
}

module.exports = karma;

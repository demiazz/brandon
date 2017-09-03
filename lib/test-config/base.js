const { join, relative } = require("path");

function createBaseConfig(babelOptions) {
  const setupPath = join(relative("", __dirname), "jasmine-setup.js");

  return {
    basePath: relative(__dirname, ""),

    frameworks: ["jasmine"],

    files: [
      {
        pattern: setupPath,
        watched: process.env.CI !== "true"
      },
      {
        pattern: "spec/spec-helpers/**/*.js",
        watched: process.env.CI !== "true"
      },
      {
        pattern: "src/**/*.js",
        watched: process.env.CI !== "true",
        included: false
      },
      {
        pattern: "spec/**/*.spec.js",
        watched: process.env.CI !== "true"
      }
    ],

    preprocessors: {
      [setupPath]: ["webpack"],
      "spec/spec-helpers/**/*.js": ["webpack"],
      "spec/**/*.spec.js": ["webpack", "sourcemap"]
    },

    webpack: {
      module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "babel-loader",
                options: babelOptions
              }
            ]
          }
        ]
      }
    },

    webpackMiddleware: {
      stats: "errors-only"
    },

    plugins: [
      "karma-jasmine",
      "karma-webpack",
      "karma-sourcemap-loader",
      "karma-spec-reporter"
    ],

    reporters: ["spec"]
  };
}

module.exports = createBaseConfig;

const { join, relative } = require("path");

const { name } = require("../pkg");

function createBaseConfig(babelOptions) {
  const pkgRoot = process.cwd();
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
        pattern: "spec/**/*.spec.js",
        watched: process.env.CI !== "true"
      }
    ],

    preprocessors: {
      [setupPath]: ["webpack", "sourcemap"],
      "spec/**/*.spec.js": ["webpack", "sourcemap"]
    },

    webpack: {
      devtool: "inline-source-map",
      resolve: {
        alias: {
          [name]: join(pkgRoot, "src")
        },
        modules: [join(pkgRoot, "spec"), join(pkgRoot, "node_modules")]
      },
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

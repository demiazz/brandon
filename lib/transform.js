const babel = require("babel-core");

const { browsersList } = require("./pkg");

function createBabelOptions(options = {}) {
  const result = {
    presets: [
      [
        "env",
        {
          modules: options.modules,
          targets: {
            browsers: browsersList,
            uglify: false
          },
          useBuiltIns: options.useBuiltIns ? "usage" : false
        }
      ]
    ],
    plugins: []
  };

  if (options.types) {
    result.plugins.push("syntax-flow");
  } else {
    result.presets.push("flow");
  }

  if (options.coverage) {
    result.plugins.push(["istanbul", { include: "src" }]);
  }

  return result;
}

function minify(code, options = {}) {
  return babel.transform(code, {
    presets: ["minify"],
    sourceFileName: options.from,
    sourceMaps: true,
    sourceMapTarget: options.to
  });
}

function removeTypes(code) {
  return babel.transform(code, { presets: ["flow"] }).code;
}

function transform(code, options = {}) {
  return babel.transform(code, createBabelOptions(options)).code;
}

module.exports = { createBabelOptions, minify, removeTypes, transform };

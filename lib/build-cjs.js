const { dirname } = require("path");

const camelCase = require("camel-case");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const commonJS = require("rollup-plugin-commonjs");

const { createBabelOptions } = require("./transform");
const { fullBanner } = require("./banner");
const formatCode = require("./format");
const logger = require("./logger");
const { unprefixedName } = require("./pkg");
const { createDirectory, writeFile } = require("./utils");

function createRollupOptions() {
  const babelOptions = createBabelOptions({
    types: false,
    modules: false
  });

  return {
    input: "src/index.js",
    exports: "auto",
    plugins: [babel(babelOptions), commonJS()]
  };
}

function createWriteOptions() {
  const file = `lib/${unprefixedName}.js`;
  const format = "cjs";
  const name = camelCase(unprefixedName);
  const sourcemap = false;

  return { banner: fullBanner, file, format, name, sourcemap };
}

async function buildCommonJSBundle() {
  logger.step("Generate CommonJS module");
  const rollupOptions = createRollupOptions();
  const writeOptions = createWriteOptions();
  const bundle = await rollup.rollup(rollupOptions);
  const { code } = await bundle.generate(writeOptions);
  logger.stepDone();

  logger.step("Write CommonJS module");
  await createDirectory(dirname(writeOptions.file));
  await writeFile(writeOptions.file, formatCode(code));
  logger.stepDone();
}

async function buildCommonJS() {
  try {
    logger.task("Build CommonJS module");

    await buildCommonJSBundle();

    logger.taskDone();
  } catch (error) {
    logger.stepFail();
    logger.taskFail();
  }
}

module.exports = buildCommonJS;

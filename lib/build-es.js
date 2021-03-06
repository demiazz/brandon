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
  const file = `lib-es/${unprefixedName}.js`;
  const format = "es";
  const name = camelCase(unprefixedName);
  const sourcemap = false;

  return { banner: fullBanner, file, format, name, sourcemap };
}

async function buildESModuleBundle() {
  logger.step("Generate ES module");
  const rollupOptions = createRollupOptions();
  const writeOptions = createWriteOptions();
  const bundle = await rollup.rollup(rollupOptions);
  const { code } = await bundle.generate(writeOptions);
  logger.stepDone();

  logger.step("Write ES module");
  await createDirectory(dirname(writeOptions.file));
  await writeFile(writeOptions.file, formatCode(code));
  logger.stepDone();
}

async function buildESModule() {
  try {
    logger.task("Build ES module");

    await buildESModuleBundle();

    logger.taskDone();
  } catch (error) {
    logger.stepFail();
    logger.taskFail();
  }
}

module.exports = buildESModule;

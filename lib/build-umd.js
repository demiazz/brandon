const { dirname } = require("path");

const camelCase = require("camel-case");
const rollup = require("rollup");
const babel = require("rollup-plugin-babel");
const commonJS = require("rollup-plugin-commonjs");
const { SourceMapConsumer, SourceNode } = require("source-map");

const { createBabelOptions, minify } = require("./transform");
const { minifiedBanner, fullBanner } = require("./banner");
const formatCode = require("./format");
const logger = require("./logger");
const { name: prefixedName, unprefixedName } = require("./pkg");
const { createDirectory, readFile, writeFile } = require("./utils");

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
  const file = `dist/${unprefixedName}.js`;
  const format = "umd";
  const name = camelCase(unprefixedName);
  const amd = { id: prefixedName };
  const sourcemap = false;

  return { banner: fullBanner, file, format, name, amd, sourcemap };
}

async function buildUMDBundle() {
  logger.step("Generate unminified module");
  const rollupOptions = createRollupOptions();
  const writeOptions = createWriteOptions();
  const bundle = await rollup.rollup(rollupOptions);
  const { code } = await bundle.generate(writeOptions);
  logger.stepDone();

  logger.step("Write unminified module");
  await createDirectory(dirname(writeOptions.file));
  await writeFile(writeOptions.file, formatCode(code));
  logger.stepDone();
}

async function buildMinifiedUMDBundle() {
  logger.step("Read unminified module");
  const source = await readFile(`dist/${unprefixedName}.js`);
  logger.stepDone();

  logger.step("Minify module");
  const { code: minifiedCode, map: minifiedMap } = minify(source);
  logger.stepDone();

  logger.step("Append copyright");
  const consumer = new SourceMapConsumer(minifiedMap);
  const node = SourceNode.fromStringWithSourceMap(minifiedCode, consumer);

  node.prepend(`${minifiedBanner}\n`);

  const bundle = node.toStringWithSourceMap({
    file: `${unprefixedName}.min.js`
  });
  const code = `${
    bundle.code
  }\n//# sourceMappingURL=${unprefixedName}.min.js.map`;
  logger.stepDone();

  logger.step("Write minified module");
  await writeFile(`dist/${unprefixedName}.min.js`, code);
  await writeFile(`dist/${unprefixedName}.min.js.map`, bundle.map);
  logger.stepDone();
}

async function buildUMD() {
  try {
    logger.task("Build UMD module");

    await buildUMDBundle();
    await buildMinifiedUMDBundle();

    logger.taskDone();
  } catch (error) {
    logger.stepFail();
    logger.taskFail();
  }
}

module.exports = buildUMD;

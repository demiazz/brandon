const { dirname, join, relative } = require("path");

const { format } = require("prettier");

const logger = require("./logger");
const { transform } = require("./transform");
const { createDirectory, readDir, readFile, writeFile } = require("./utils");

async function getFiles() {
  const absolutesPaths = await readDir("src");

  return absolutesPaths.map(absolutePath => ({
    absolutePath,
    relativePath: relative("src", absolutePath)
  }));
}

async function readSource({ absolutePath, relativePath }) {
  const code = await readFile(absolutePath);

  return { code, file: relativePath };
}

function readSources(files) {
  return Promise.all(files.map(readSource));
}

function transformSource({ file, code }, transformOptions) {
  const options = Object.assign({}, transformOptions, { comments: false });

  return { file, code: transform(code, options) };
}

function transformSources(sources, modules) {
  const transformOptions = { modules: modules === "es" ? false : "commonjs" };

  return sources.map(source => transformSource(source, transformOptions));
}

function formatSource({ file, code }) {
  return { file, code: format(code) };
}

function formatSources(sources) {
  return sources.map(formatSource);
}

async function writeSource({ file, code }, outputRoot) {
  const outputPath = join(outputRoot, file);

  await createDirectory(dirname(outputPath));
  await writeFile(outputPath, code);
}

function writeSources(sources, modules) {
  const outputRoot = modules === "es" ? "lib-es" : "lib";

  return Promise.all(
    sources.map(
      source =>
        source.code.trim().length > 0
          ? writeSource(source, outputRoot)
          : Promise.resolve()
    )
  );
}

async function buildModules(modules) {
  try {
    logger.task(
      modules === "es" ? "Build ES modules" : "Build CommonJS modules"
    );

    logger.step("Read sources");
    const files = await getFiles();
    const sources = await readSources(files);
    logger.stepDone();

    logger.step("Transform sources");
    const transformedSources = transformSources(sources, modules);
    logger.stepDone();

    logger.step("Format sources");
    const formattedSources = formatSources(transformedSources);
    logger.stepDone();

    logger.step("Write sources");
    await writeSources(formattedSources, modules);
    logger.stepDone();

    logger.taskDone();
  } catch (error) {
    logger.stepFail();
    logger.taskFail();
  }
}

module.exports = buildModules;

const childProcess = require("child_process");
const { relative } = require("path");

const documentation = require("documentation");

const logger = require("./logger");
const { getBin, readDir, readFile, writeFile } = require("./utils");

const OPEN_TAG = "<!-- API: BEGIN -->";
const CLOSE_TAG = "<!-- API: END -->";

async function getFiles() {
  const files = await readDir("src");

  return files.map(file => relative("", file));
}

function generateDocumentation(sources) {
  return documentation.build(sources, {});
}

function formatDocumentation(docs) {
  return documentation.formats.md(docs, {});
}

async function writeDocumentation(docs) {
  const readme = await readFile("README.md");
  const intro = readme.slice(0, readme.indexOf(OPEN_TAG) + OPEN_TAG.length);
  const outro = readme.slice(readme.indexOf(CLOSE_TAG));

  await writeFile("README.md", `${intro}${docs}${outro}`);
}

async function updateTableOfContents() {
  const doctoc = await getBin("doctoc");

  return new Promise((resolve, reject) => {
    const command = [
      doctoc,
      "--github",
      "--title '**Table of Contents**'",
      "README.md"
    ].join(" ");

    childProcess.exec(command, error => (error ? reject(error) : resolve()));
  });
}

async function updateDocumentation() {
  try {
    logger.task("Update API documentation");

    logger.step("Read sources list");
    const files = await getFiles();
    logger.stepDone();

    logger.step("Generate API documentation");
    const docs = await generateDocumentation(files);
    logger.stepDone();

    logger.step("Format API documentation");
    const markdown = await formatDocumentation(docs);
    logger.stepDone();

    logger.step("Write API documentation");
    await writeDocumentation(markdown);
    logger.stepDone();

    logger.step("Update table of contents");
    await updateTableOfContents();
    logger.stepDone();

    logger.taskDone();
  } catch (error) {
    logger.stepFail();
    logger.taskFail();
  }
}

module.exports = updateDocumentation;

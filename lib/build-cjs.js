const buildModules = require("./build-modules");

async function buildCJS() {
  await buildModules("cjs");
}

module.exports = buildCJS;

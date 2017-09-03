const buildModules = require("./build-modules");

async function buildES() {
  await buildModules("es");
}

module.exports = buildES;

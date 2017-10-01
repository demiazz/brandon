const application = require("commander");

const checkTypes = require("./check-types");
const buildUMD = require("./build-umd");
const buildES = require("./build-es");
const buildCJS = require("./build-cjs");
const updateDocumentation = require("./documentation");
const { startLocalTests, startCITests } = require("./test");

application
  .command("check-types")
  .description("check types")
  .action(checkTypes);

application
  .command("build-umd")
  .description("build UMD modules")
  .action(buildUMD);

application
  .command("build-es")
  .description("build ES modules")
  .action(buildES);

application
  .command("build-cjs")
  .description("build CommonJS modules")
  .action(buildCJS);

application
  .command("build")
  .description("build UMD, ES and CommonJS modules")
  .action(async () => {
    await buildUMD();
    await buildES();
    await buildCJS();
  });

application
  .command("documentation")
  .description("update documentation")
  .action(updateDocumentation);

application
  .command("test")
  .option("-b, --browsers <browsers>", "run tests on given browsers")
  .option("-w, --watch", "run tests in watch mode")
  .description("run tests")
  .action(({ browsers, watch }) => {
    startLocalTests(browsers || "Chrome", watch || false);
  });

application
  .command("test-ci")
  .description("run CI tests")
  .action(() => startCITests());

application.parse(process.argv);

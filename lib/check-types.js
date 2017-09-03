const childProcess = require("child_process");

const flow = require("flow-bin");

function checkTypes() {
  childProcess
    .spawn(flow, ["--show-all-errors", "src"], { stdio: "inherit" })
    .on("exit", process.exit);
}

module.exports = checkTypes;

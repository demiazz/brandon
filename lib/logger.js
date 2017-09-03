const chalk = require("chalk");

function write(message) {
  process.stdout.write(message);
}

function task(message) {
  write(chalk.bold(`===== ${message}`));
  write("\n");
}

function taskDone() {
  write(chalk.bold(`===== `));
  write(chalk.bold.green(`Success`));
  write("\n");
}

function taskFail() {
  write(chalk.bold(`===== `));
  write(chalk.bold.red(`Failed`));
  write("\n");
}

function step(message) {
  write(`      ${message}...`.padEnd(45), true);
}

function stepDone() {
  write(`${chalk.green("done")}\n`);
}

function stepFail() {
  write(`${chalk.red("failed")}\n`);
}

module.exports = { task, taskDone, taskFail, step, stepDone, stepFail };

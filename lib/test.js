const childProcess = require("child_process");
const { join, relative } = require("path");

const { getBin } = require("./utils");

function getConfigPath(type) {
  return relative("", join(__dirname, "test-config", `${type}.js`));
}

async function start(...args) {
  const karma = await getBin("karma");
  const env = Object.assign({}, process.env, { NODE_ENV: "test" });
  const options = { env, stdio: "inherit" };

  childProcess
    .spawn(karma, ["start"].concat(args), options)
    .on("exit", process.exit);
}

function parseBrowsersList(list) {
  const availableBrowsers = {
    phantomjs: "PhantomJS",
    chrome: "Chrome",
    firefox: "Firefox",
    safari: "Safari"
  };

  const browsers = list.split(",").reduce((result, item) => {
    const browser = availableBrowsers[item.toLowerCase().trim()];

    if (browser && result.indexOf(browser) === -1) {
      result.push(browser);
    }

    return result;
  }, []);

  if (browsers.length === 0) {
    browsers.push("PhantomJS");
  }

  return browsers.join(",");
}

function startLocalTests(browsers, watch) {
  const configPath = getConfigPath("local");
  const singleRun = watch ? "--no-single-run" : "--single-run";

  start(configPath, "--browsers", parseBrowsersList(browsers), singleRun);
}

function startCITests() {
  const configPath = getConfigPath("ci");

  start(configPath, "--single-run");
}

module.exports = { startLocalTests, startCITests };

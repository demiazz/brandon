const browserslist = require("browserslist");

const { browsersList } = require("../pkg");

const MAX_CHROME_VERSION = 61;

function chrome(query) {
  const majorVersion = parseInt(query, 10);

  if (majorVersion > MAX_CHROME_VERSION) {
    return null;
  }

  return {
    [`sl_chrome_${majorVersion}`]: {
      base: "SauceLabs",
      browserName: "chrome",
      version: `${majorVersion}.0`,
      platform: "Windows 10"
    }
  };
}

const MAX_FIREFOX_VERSION = 55;

function firefox(query) {
  const majorVersion = parseInt(query, 10);

  if (majorVersion > MAX_FIREFOX_VERSION) {
    return null;
  }

  return {
    [`sl_firefox_${majorVersion}`]: {
      base: "SauceLabs",
      browserName: "firefox",
      version: `${majorVersion}.0`,
      platform: "Windows 10"
    }
  };
}

const MAX_EDGE_VERSION = 15;

function edge(query) {
  const majorVersion = parseInt(query, 10);

  if (majorVersion > MAX_EDGE_VERSION) {
    return null;
  }

  let version;

  if (majorVersion === 15) {
    version = "15.15063";
  } else if (majorVersion === 14) {
    version = "14.14393";
  } else if (majorVersion === 13) {
    version = "13.10586";
  }

  return {
    [`sl_edge_${majorVersion}`]: {
      base: "SauceLabs",
      browserName: "MicrosoftEdge",
      version,
      platform: "Windows 10"
    }
  };
}

const MIN_IE_VERSION = 9;

function ie(query) {
  const majorVersion = parseInt(query, 10);

  if (majorVersion < MIN_IE_VERSION) {
    return null;
  }

  let version;
  let platform;

  if (majorVersion === 11) {
    version = "11.103";
    platform = "Windows 10";
  } else if (majorVersion === 10) {
    version = "10.0";
    platform = "Windows 8";
  } else if (majorVersion === 9) {
    version = "9.0";
    platform = "Windows 7";
  }

  return {
    [`sl_ie_${majorVersion}`]: {
      base: "SauceLabs",
      browserName: "internet explorer",
      version,
      platform
    }
  };
}

const MIN_SAFARI_VERSION = 6;
const MAX_SAFARI_VERSION = 10;

function safari(query) {
  const majorVersion = parseInt(query.match(/(\d+)(?:\.\d+)?/)[0], 10);

  if (majorVersion < MIN_SAFARI_VERSION) {
    return null;
  }

  if (majorVersion > MAX_SAFARI_VERSION) {
    return null;
  }

  return {
    [`sl_safari_${majorVersion}`]: {
      base: "SauceLabs",
      browserName: "Safari",
      version: `${majorVersion}.0`,
      platform: `OS X 10.${majorVersion + 2}`
    }
  };
}

const AVAILABLE_IOS_VERSIONS = [
  "10.3",
  "10.2",
  "10.0",
  "9.3",
  "9.2",
  "9.1",
  "9.0",
  "8.4",
  "8.3",
  "8.2",
  "8.1"
];

function ios(query) {
  const majorVersions = query.indexOf("-") === -1 ? [query] : query.split("-");

  return majorVersions.reduce((config, version) => {
    if (AVAILABLE_IOS_VERSIONS.indexOf(version) !== -1) {
      Object.assign(config, {
        [`sl_ios_${version.replace(".", "_")}`]: {
          base: "SauceLabs",
          browserName: "Safari",
          appiumVersion: "1.6.5",
          deviceName: "iPhone Simulator",
          deviceOrientation: "portrait",
          platformVersion: version,
          platformName: "iOS"
        }
      });
    }

    return config;
  }, {});
}

function parseBrowsers(browsers) {
  const configs = browsers.map(browser => {
    const [name, version] = browser.split(" ");

    switch (name) {
      case "chrome":
        return chrome(version);
      case "firefox":
        return firefox(version);
      case "edge":
        return edge(version);
      case "ie":
        return ie(version);
      case "safari":
        return safari(version);
      case "ios_saf":
        return ios(version);
      default:
        return null;
    }
  });

  return configs.reduce((result, config) => {
    if (config) {
      Object.assign(result, config);
    }

    return result;
  }, {});
}

function sauceLabs() {
  return parseBrowsers(browserslist(browsersList));
}

module.exports = sauceLabs();

const {
  name,
  version,
  homepage,
  authorName,
  authorEmail,
  license
} = require("./pkg");

const minifiedBanner = `/*! ${[
  `${name} v${version}`,
  `(c) ${authorName} <${authorEmail}>`,
  `${license} license`
].join(" | ")} */`;

const fullBanner = [
  "/*!",
  ` * ${name} v${version}`,
  ` * ${homepage}`,
  " *",
  ` * Copyright ${authorName} <${authorEmail}>`,
  ` * Released under the ${license} license`,
  " */"
].join("\n");

module.exports = { minifiedBanner, fullBanner };

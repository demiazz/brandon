const { sync: readPkg } = require("read-pkg-up");

const {
  name,
  version,
  homepage,
  license,
  author: { name: authorName, email: authorEmail },
  browserslist: browsersList
} = readPkg().pkg;

const pkg = Object.freeze({
  name,
  version,
  homepage,
  license,
  authorName,
  authorEmail,
  browsersList
});

module.exports = pkg;

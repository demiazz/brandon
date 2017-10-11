const { sync: readPkg } = require("read-pkg-up");

function unprefixName(pkgName) {
  const [namespace, name] = pkgName.split("/");

  return name || namespace;
}

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
  unprefixedName: unprefixName(name),
  version,
  homepage,
  license,
  authorName,
  authorEmail,
  browsersList
});

module.exports = pkg;

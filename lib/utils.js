const fs = require("fs");

const mkdirp = require("mkdirp");
const which = require("npm-which");
const recursiveReaddir = require("recursive-readdir");

function readFile(file, options = {}) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      file,
      options,
      (error, content) => (error ? reject(error) : resolve(content.toString()))
    );
  });
}

function writeFile(file, content, options = {}) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      file,
      content,
      options,
      error => (error ? reject(error) : resolve())
    );
  });
}

function createDirectory(directoryPath, options = {}) {
  return new Promise((resolve, reject) => {
    mkdirp(
      directoryPath,
      options,
      error => (error ? reject(error) : resolve())
    );
  });
}

function readDir(directoryPath) {
  return new Promise((resolve, reject) => {
    recursiveReaddir(
      directoryPath,
      (error, files) => (error ? reject(error) : resolve(files))
    );
  });
}

async function getBin(bin) {
  return new Promise((resolve, reject) => {
    which(
      bin,
      { cwd: process.cwd() },
      (error, binPath) => (error ? reject(error) : resolve(binPath))
    );
  });
}

module.exports = { createDirectory, getBin, readDir, readFile, writeFile };

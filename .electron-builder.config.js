/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const { readFileSync } = require('node:fs');
const info = JSON.parse(readFileSync('dist/build-info.json', 'utf8'));
const variant = info.includedBasemapKey ? '' : '-personal-key-only';
module.exports = {
  appId: "ScriptNet",
  productName: "ScriptNet",
  copyright: "Copyright © 2020-2022 University of Manchester",
  asar: true,
  directories: {
    output: "release/${version}",
    buildResources: "build",
  },
  files: ["dist"],
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
    artifactName: '${productName}-${version}-${arch}' + variant + '-Setup.${ext}',
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowToChangeInstallationDirectory: true,
    deleteAppDataOnUninstall: false,
  },
  mac: {
    target: ["dmg"],
    minimumSystemVersion: "13.0",
    artifactName: '${productName}-${version}-${arch}' + variant + '-Installer.${ext}',
  },
  linux: {
    target: ["AppImage"],
    artifactName: '${productName}-${version}-${arch}' + variant + '-Installer.${ext}',
  },
}

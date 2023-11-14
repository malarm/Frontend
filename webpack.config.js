const { join } = require('path');
const { workspaceRoot } = require('nx/src/devkit-exports');

const config = require(join(workspaceRoot, 'webpack.config.base.js'));

module.exports = config({});

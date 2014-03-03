#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var rimraf = require('rimraf').sync;

var project = require(path.resolve('./package.json'));
var dependencyPath = './node_modules/' + project.name;

if (fs.existsSync(dependencyPath)) {
  console.log('Deleting installed "%s" dependency, see https://github.com/isaacs/npm/issues/3958', project.name);
  rimraf(dependencyPath);
}

'use strict';

var grunt = require('../../lib/grunt');

// Parse options printed by fixtures/Gruntfile-cli into an object.
var optionValueRe = /###(.*?)###/;
function getOptionValues(str) {
  var matches = str.match(optionValueRe);
  return matches ? JSON.parse(matches[1]) : {};
}

// Helper to promisify grunt.util.spawn
async function spawnGrunt(args) {
  return new Promise((resolve, reject) => {
    grunt.util.spawn({ cmd: process.execPath, args: ['bin/grunt', ...args] }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

QUnit.module('cli');
QUnit.test('--debug taskname', async function(assert) {
  const result = await spawnGrunt([
    '--gruntfile', 'test/fixtures/Gruntfile-cli.js', '--debug', 'debug', 'finalize'
  ]);
  assert.deepEqual(getOptionValues(result.stdout), { debug: 1 }, 'Options parsed');
});

QUnit.test('taskname --debug', async function(assert) {
  const result = await spawnGrunt([
    '--gruntfile', 'test/fixtures/Gruntfile-cli.js', 'debug', '--debug', 'finalize'
  ]);
  assert.deepEqual(getOptionValues(result.stdout), { debug: 1 }, 'Options parsed');
});

QUnit.test('--debug --verbose', async function(assert) {
  const result = await spawnGrunt([
    '--gruntfile', 'test/fixtures/Gruntfile-cli.js', '--debug', '--verbose', 'debug', 'verbose', 'finalize'
  ]);
  assert.deepEqual(getOptionValues(result.stdout), { debug: 1, verbose: true }, 'Options parsed');
});

QUnit.test('--verbose --debug', async function(assert) {
  const result = await spawnGrunt([
    '--gruntfile', 'test/fixtures/Gruntfile-cli.js', '--verbose', '--debug', 'debug', 'verbose', 'finalize'
  ]);
  assert.deepEqual(getOptionValues(result.stdout), { debug: 1, verbose: true }, 'Options parsed');
});

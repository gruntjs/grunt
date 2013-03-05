/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var exitCalled = false;
var storedExitCode = 0;

// This seems to be required in Windows (as of Node.js 0.8.7) to ensure that
// stdout/stderr are flushed before the process exits.

// https://gist.github.com/3427148
// https://gist.github.com/3427357
// Note that _pendingWriteReqs is not in the public API of Node.js.
// The drain event has to be used instead.

var streamFinished = function (stream, callback) {
  // Writes an empty string to check the state of the buffer:
  if (stream.write("")) {
    return true;
  }
  stream.once('drain', callback);
  return false;
};

var exit = function () {
  var ok = true;
  ok = ok && streamFinished(process.stdout, exit);
  ok = ok && streamFinished(process.stderr, exit);
  if (ok) {
    process.exit(storedExitCode);
  }
};

// Exits the process, making sure the stdout and stderr streams have fully received their content.
exports.exit = function (exitCode) {
  var firstExit = !exitCalled;
  if (firstExit) {
    exitCalled = true;
    storedExitCode = exitCode;
  }
  exit();
};

exports.hasExited = function () {
  return exitCalled;
};

/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2013 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

// This seems to be required in Windows (as of Node.js 0.8.7) to ensure that
// stdout/stderr are flushed before the process exits.

// https://gist.github.com/3427148
// https://gist.github.com/3427357

var exitCalled = false;
var exitCode = 0;

// Write an empty string to check the state of the buffer. Per the docs:
// If a writable.write(chunk) call returns false, then the drain event will
// indicate when it is appropriate to begin writing more data to the stream.
function streamFinished(stream) {
  var finished = stream.write('');
  if (!finished) {
    stream.once('drain', tryToExit);
  }
  return finished;
}

// If both stdout and stderr streams have been fully drained, actually exit.
function tryToExit() {
  if (streamFinished(process.stdout) && streamFinished(process.stderr)) {
    process.exit(exitCode);
  }
}

// Set a few properties, then try to exit.
exports.exit = function(code) {
  if (!exitCalled) {
    exitCalled = true;
    exitCode = code || 0;
    tryToExit();
  }
};

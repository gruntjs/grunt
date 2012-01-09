/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

// Temporarily suppress output.
var suppressOutput;

// Allow external muting of output.
exports.muted = false;

// True once anything has actually been logged.
var hasLogged;

// Apparently writing to stdout in node.js is non-blocking. But stderr blocks.
// So we'll use that instead. WTF. https://github.com/joyent/node/issues/1669
process.stdout = process.stderr;

// Write output.
exports.write = function(msg) {
  // Actually write output.
  if (!exports.muted && !suppressOutput) {
    hasLogged = true;
    process.stdout.write(msg || '');
  }
  // Chainable!
  return this;
};

// Write a line of output.
exports.writeln = function(msg) {
  // Actually write output.
  this.write((msg || '') + '\n');
  // Chainable!
  return this;
};

// Stuff.

exports.error = function(msg) {
  if (msg) { fail.errorcount++; }
  return this.writeln(msg ? '>> '.red + msg : 'ERROR'.red);
};
exports.ok = function(msg) { return this.writeln(msg ? '>> '.green + msg : 'OK'.green); };
exports.success = function(msg) { return this.writeln(msg.green); };
exports.fail = function(msg) { return this.writeln(msg.red); };
exports.header = function(msg) {
  // Skip line before header, but not if header is the very first line output.
  if (hasLogged) { this.writeln(); }
  return this.writeln(msg.underline);
};
exports.subhead = function(msg) {
  // Skip line before subhead, but not if subhead is the very first line output.
  if (hasLogged) { this.writeln(); }
  return this.writeln(msg.bold);
};

// Display flags in verbose mode.
exports.writeflags = function(obj, prefix) {
  var wordlist;
  if (obj instanceof Array) {
    wordlist = log.wordlist(obj);
  } else if (typeof obj === 'object' && obj) {
    wordlist = log.wordlist(Object.keys(obj).map(function(key) {
      var val = obj[key];
      return key + (val === true ? '' : '=' + JSON.stringify(val));
    }));
  }
  return this.writeln((prefix || 'Flags') + ': ' + (wordlist || '(none)'.cyan));
};

// Create explicit "verbose" and "notverbose" functions, one for each already-
// defined log function, that do the same thing but ONLY if -v or --verbose is
// specified (or not specified).
exports.verbose = {};
exports.notverbose = {};

// Iterate over all exported functions.
Object.keys(exports).filter(function(key) {
  return typeof exports[key] === 'function';
}).forEach(function(key) {
  // Like any other log function, but suppresses output if the "verbose" option
  // IS NOT set.
  exports.verbose[key] = function() {
    suppressOutput = !option('verbose');
    exports[key].apply(this, arguments);
    suppressOutput = false;
    return this;
  };
  // Like any other log function, but suppresses output if the "verbose" option
  // IS set.
  exports.notverbose[key] = function() {
    suppressOutput = option('verbose');
    exports[key].apply(this, arguments);
    suppressOutput = false;
    return this;
  };
});

// A way to switch between verbose and notverbose modes. For example, this will
// write 'foo' if verbose logging is enabled, otherwise write 'bar':
// verbose.write('foo').or.write('bar');
exports.verbose.or = exports.notverbose;
exports.notverbose.or = exports.verbose;

// Static methods.

// Pretty-format a word list.
exports.wordlist = function(arr, separator) {
  return arr.map(function(item) {
    return item.cyan;
  }).join(separator || ', ');
};

// Return a string, uncolored (suitable for testing .length, etc).
exports.uncolor = function(str) {
  return str.replace(/\x1B\[\d+m/g, '');
};

// Get a string `str` repeated `n` times.
exports.pad = function(n, str) {
  return new Array(n + 1).join(str || ' ');
};

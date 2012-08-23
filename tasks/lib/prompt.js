/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

// External lib.
var prompt = require('prompt');
prompt.message = '[' + '?'.green + ']';
prompt.delimiter = ' ';

exports.init = function(grunt) {
  var exports = {};

  // Expose prompts object so that prompts can be added or modified.
  exports.prompts = {};

  // Prompt user to override default values passed in obj.
  exports.process = function(defaults, options, done) {
    // If defaults are omitted, shuffle arguments a bit.
    if (grunt.util.kindOf(defaults) === 'array') {
      done = options;
      options = defaults;
      defaults = {};
    }

    // Keep track of any "sanitize" functions for later use.
    var sanitize = {};
    options.forEach(function(option) {
      if (option.sanitize) {
        sanitize[option.name] = option.sanitize;
      }
    });

    // Add one final "are you sure?" prompt.
    if (options.length > 0) {
      options.push({
        message: 'Do you need to make any changes to the above before continuing?'.green,
        name: 'ANSWERS_VALID',
        default: 'y/N'
      });
    }

    // Ask user for input. This is in an IIFE because it has to execute at least
    // once, and might be repeated.
    (function ask() {
      grunt.log.subhead('Please answer the following:');
      var result = grunt.util._.clone(defaults);
      // Loop over each prompt option.
      grunt.util.async.forEachSeries(options, function(option, done) {
        var defaultValue;
        grunt.util.async.forEachSeries(['default', 'altDefault'], function(prop, next) {
          if (typeof option[prop] === 'function') {
            // If the value is a function, execute that function, using the
            // value passed into the return callback as the new default value.
            option[prop](defaultValue, result, function(err, value) {
              defaultValue = String(value);
              next();
            });
          } else {
            // Otherwise, if the value actually exists, use it.
            if (prop in option) {
              defaultValue = option[prop];
            }
            next();
          }
        }, function() {
          // Handle errors (there should never be errors).
          option.default = defaultValue;
          delete option.altDefault;
          // Wrap validator so that answering '?' always fails.
          var validator = option.validator;
          option.validator = function(line, next) {
            if (line === '?') {
              return next(false);
            } else if (validator) {
              if (validator.test) {
                return next(validator.test(line));
              } else if (typeof validator === 'function') {
                return validator.length < 2 ? next(validator(line)) : validator(line, next);
              }
            }
            next(true);
          };
          // Actually get user input.
          prompt.start();
          prompt.getInput(option, function(err, line) {
            if (err) { return done(err); }
            option.validator = validator;
            result[option.name] = line;
            done();
          });
        });
      }, function(err) {
        // After all prompt questions have been answered...
        if (/n/i.test(result.ANSWERS_VALID)) {
          // User accepted all answers. Suspend prompt.
          prompt.pause();
          // Clean up.
          delete result.ANSWERS_VALID;
          // Iterate over all results.
          grunt.util.async.forEachSeries(Object.keys(result), function(name, next) {
            // If this value needs to be sanitized, process it now.
            if (sanitize[name]) {
              sanitize[name](result[name], result, function(err, value) {
                if (err) {
                  result[name] = err;
                } else if (arguments.length === 2) {
                  result[name] = value === 'none' ? '' : value;
                }
                next();
              });
            } else {
              if (result[name] === 'none') { result[name] = ''; }
              next();
            }
          }, function(err) {
            // Done!
            grunt.log.writeln();
            done(err, result);
          });
        } else {
          // Otherwise update the default value for each user prompt option...
          options.slice(0, -1).forEach(function(option) {
            option.default = result[option.name];
          });
          // ...and start over again.
          ask();
        }
      });
    }());
  };

  // Commonly-used prompt options with meaningful default values.
  exports.prompt = function(name, altDefault) {
    // Clone the option so the original options object doesn't get modified.
    var option = grunt.util._.clone(exports.prompts[name]);
    option.name = name;

    var defaults = grunt.task.readDefaults('init/defaults.json');
    if (name in defaults) {
      // A user default was specified for this option, so use its value.
      option.default = defaults[name];
    } else if (arguments.length === 2) {
      // An alternate default was specified, so use it.
      option.altDefault = altDefault;
    }
    return option;
  };

  return exports;
};

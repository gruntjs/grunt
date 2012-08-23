/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

exports.init = function(grunt) {
  var exports = {};

  // Get the git origin url from the current repo (if possible).
  exports.origin = function(done) {
    grunt.util.spawn({
      cmd: 'git',
      args: ['remote', '-v']
    }, function(err, result, code) {
      var re = /^origin\s/;
      var lines;
      if (!err) {
        lines = String(result).split('\n').filter(re.test, re);
        if (lines.length > 0) {
          done(null, lines[0].split(/\s/)[1]);
          return;
        }
      }
      done(true, 'none');
    });
  };

  // Generate a GitHub web URL from a GitHub repo URI.
  var githubUrlRegex = /^.+(?:@|:\/\/)(github.com)[:\/](.+?)(?:\.git|\/)?$/;
  exports.githubUrl = function(uri, suffix) {
    var matches = githubUrlRegex.exec(uri);
    if (!matches) { return null; }
    var url = 'https://' + matches[1] + '/' + matches[2];
    if (suffix) {
      url += '/' + suffix.replace(/^\//, '');
    }
    return url;
  };

  return exports;
};

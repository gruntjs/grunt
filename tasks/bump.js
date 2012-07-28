/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 *
 * Increase version number
 *
 * grunt bump
 * grunt bump:patch
 * grunt bump:minor
 * grunt bump:major
 *
 * @author Vojta Jina <vojta.jina@gmail.com>
 */

module.exports = function(grunt) {
  grunt.registerTask('bump', 'Increment the version number.', function(versionType) {
    var PACKAGE_FILE = 'package.json';
    var package = grunt.file.readJSON(PACKAGE_FILE);

    // compute the new version
    package.version = grunt.helper('bump_version', package.version, versionType || 'patch');

    grunt.file.write(PACKAGE_FILE, JSON.stringify(package, null, '  '));
    grunt.log.write('Version bumped to ' + package.version);
  });


  grunt.registerHelper('bump_version', function(version, versionType) {
    var type = {
      patch: 2,
      minor: 1,
      major: 0
    };

    var parts = version.split('.');
    var idx = type[versionType || 'patch'];

    parts[idx] = parseInt(parts[idx], 10) + 1;
    while(++idx < parts.length) {
      parts[idx] = 0;
    }
    return parts.join('.');
  });
};

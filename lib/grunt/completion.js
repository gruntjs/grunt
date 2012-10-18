/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var grunt = require('../grunt');

// Nodejs libs.
var path = require('path');

var name = grunt.option('completion');
var base = path.join(__dirname, '../../misc/completion');
var filepath = path.join(base, name);

if (grunt.file.exists(filepath)) {
  console.log(grunt.file.read(filepath));
} else {
  grunt.log.writeln('echo \'Specified shell auto-completion rules not found.' +
    ' Use: eval "$(grunt --completion=SHELL)", where SHELL is one of: ' +
    grunt.file.expandFiles({cwd: base}, '*').join(', ') + '.\'');
  grunt.util.exit(grunt.fail.code.INVALID_AUTOCOMPLETE);
}

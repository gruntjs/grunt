/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt, init, done) {
  // Grunt utilities.
  var task = grunt.task;
  var file = grunt.file;
  var utils = grunt.utils;
  var log = grunt.log;
  var verbose = grunt.verbose;
  var fail = grunt.fail;
  var option = grunt.option;
  var config = grunt.config;
  var template = grunt.template;

  grunt.helper('prompt', {type: 'grunt'}, [
    // Prompt for these values.
    grunt.helper('prompt_for', 'name', function(value, data, done) {
      // Prepend "grunt-" to default name if not already there.
      data.short_name = value;
      value = data.full_name = 'grunt-' + value;
      // if (!/^grunt-/.test(value)) { value = 'grunt-' + value; }
      done(null, value);
    }),
    grunt.helper('prompt_for', 'description', 'The best sample grunt tasks ever.'),
    grunt.helper('prompt_for', 'version'),
    grunt.helper('prompt_for', 'repository'),
    grunt.helper('prompt_for', 'homepage'),
    grunt.helper('prompt_for', 'bugs'),
    grunt.helper('prompt_for', 'licenses'),
    grunt.helper('prompt_for', 'author_name'),
    grunt.helper('prompt_for', 'author_email'),
    grunt.helper('prompt_for', 'author_url'),
    grunt.helper('prompt_for', 'grunt_version'),
    grunt.helper('prompt_for', 'node_version', '*')
  ], function(err, props) {
    // Set a few grunt-plugin-specific properties.
    props.node_main = 'grunt.js';
    props.node_test = 'grunt test';
    props.node_bin = 'bin/' + props.name;
    props.node_dependencies = {grunt: props.grunt_version};

    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process). files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackage('package.json', props);

    // All done!
    done();
  });

};

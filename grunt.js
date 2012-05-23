/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    test: {
      all: ['test/**/*.js']
    },
    lint: {
      all: ['grunt.js', 'lib/**/*.js', 'tasks/*.js', 'tasks/*/*.js', 'test/**/*.js']
    },
    docs: {
      all: ['README.md', 'docs/*.md']
    },
    watch: {
      scripts: {
        files: '<config:lint.all>',
        tasks: 'lint test'
      },
      docs: {
        files: '<config:docs.all>',
        tasks: 'docs'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      },
      globals: {}
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test docs');

  // Process markdown documentation to make the world a better place.
  grunt.registerMultiTask('docs', 'Tweak markdown documentation.', function() {
    var files = grunt.file.expandFiles(this.file.src);
    var processed = 0;
    files.forEach(function(filepath) {
      // Copying the file to itself allows it to be processed in-place.
      grunt.file.copy(filepath, filepath, {process: function(src) {
        // Add anchor links to all H2+ headers in .md document files.
        var newSrc = src.replace(/(##+)\s+(.*?)\s*<a name=.*<\/a>/g, function(_, h, title) {
          // Slugify the title text.
          var slug = grunt.utils._.slugify(title.replace(/\./g, '-'));
          // Put everything back together.
          return h + ' ' + title + ' <a name="' + slug + '" href="#' + slug +
            '" title="Link to this section">⚑</a>';
        });
        // Don't copy file if it didn't change.
        if (newSrc === src) { return false; }
        // Log and copy.
        grunt.log.writeln('File "' + filepath + '" updated.');
        processed++;
        return newSrc;
      }});
    });

    // Fail task if errors were logged.
    if (this.errorCount) { return false; }

    if (processed === 0) {
      grunt.log.writeln('No documents updated.');
    }
  });

};

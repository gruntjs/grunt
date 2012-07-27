'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    concat: {
      dist: {
        src: ['<file_strip_banner:lib/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      },
    },
    min: {
      dist: {
        src: ['<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib: {
        options: {
          jshintrc: 'lib/.jshintrc'
        },
        src: ['lib/**/*.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<config:lint.gruntfile.src>',
        tasks: ['lint:gruntfile']
      },
      lib: {
        files: '<config:lint.lib.src>',
        tasks: ['lint:lib', 'test']
      },
      test: {
        files: '<config:lint.test.src>',
        tasks: ['lint:test', 'test']
      },
    },
  });

  // Default task.
  grunt.registerTask('default', ['lint', 'test', 'concat', 'min']);

};

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({{% if (min_concat) { %}
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("m/d/yyyy") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },{% } %}
    lint: {
      files: ['grunt.js', '{%= lib_dir %}/**/*.js', '{%= test_dir %}/**/*.js']
    },{% if (dom) { %}
    qunit: {
      files: ['{%= test_dir %}/**/*.html']
    },{% } else { %}
    test: {
      files: ['{%= test_dir %}/**/*.js']
    },{% } %}{% if (min_concat) { %}
    concat: {
      dist: {
        src: ['<banner>', '<file_strip_banner:{%= lib_dir %}/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', '<config:concat.dist.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },{% } %}
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint {%= test_task %}'
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
        eqnull: true{% if (dom) { %},
        browser: true{% } %}
      },
      globals: {{% if (jquery) { %}
        jQuery: true
      {% } %}}
    }{% if (min_concat) { %},
    uglify: {}{% } %}
  });

  // Default task.
  grunt.registerTask('default', 'lint {%= test_task %}{%= min_concat ? " concat min" : "" %}');

};

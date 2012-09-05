/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({{% if (min_concat) { %}
    // Metadata.{% if (package_json) { %}
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',{% } else { %}
    meta: {
      version: '0.1.0'
    },
    banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '* http://PROJECT_WEBSITE/\n' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      'YOUR_NAME; Licensed MIT */\n',{% } } %}
    // Task configuration.{% if (min_concat) { %}
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['{%= lib_dir %}/{%= file_name %}.js'],
        dest: 'dist/{%= file_name %}.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/{%= file_name %}.min.js'
      }
    },{% } %}
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
        eqnull: true,{% if (dom) { %}
        browser: true,{% } %}
        globals: {{% if (jquery) { %}
          jQuery: true
        {% } %}}
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['{%= lib_dir %}/**/*.js', '{%= test_dir %}/**/*.js']
      }
    },{% if (dom) { %}
    {%= test_task %}: {
      files: ['{%= test_dir %}/**/*.html']
    },{% } else { %}
    {%= test_task %}: {
      files: ['{%= test_dir %}/**/*.js']
    },{% } %}
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', '{%= test_task %}']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', ['jshint', '{%= test_task %}'{%= min_concat ? ", 'concat', 'uglify'" : "" %}]);

};

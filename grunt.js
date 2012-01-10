/*global config:true, task:true*/
config.init({
  pkg: '<json:package.json>',
  meta: {
    license: ['MIT'],
    copyright: 'Copyright (c) 2012 "Cowboy" Ben Alman'
  },
  concat: {},
  min: {},
  test: {
    files: ['test/**/*.js']
  },
  lint: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
  },
  watch: {
    files: '<config:lint.files>',
    tasks: 'default'
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
      node: true
    },
    globals: {
      grequire: true,
      urequire: true,
      extraspath: true,
      _: true,
      util: true,
      task: true,
      file: true,
      fail: true,
      config: true,
      option: true,
      log: true,
      verbose: true
    }
  },
  uglify: {}
});

// Default task.
task.registerTask('default', 'lint test');

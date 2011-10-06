// Config.
config.init({
  meta: {
    name: 'grunt',
    version: '0.1.0',
    description: 'A command line build tool for JavaScript projects..',
    homepage: 'http://github.com/cowboy/node-grunt',
    author: '"Cowboy" Ben Alman',
    license: ['MIT', 'GPL'],
    copyright: 'Copyright (c) 2011 "Cowboy" Ben Alman',
    repository: 'git://github.com/cowboy/node-grunt.git'
  },
  build: {},
  test: {
    files: ['test/**']
  },
  lint: {
    files: ['lib/**', 'test/**'],
    //files: ['grunt.js'],
    pre: true,
    post: true
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
      eqnull: true,
      node: true
    },
    globals: {
      exports: true,
      module: true,
      grequire: true,
      urequire: true,
      exit: true,
      _: true,
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

// Tasks.
task.registerTask('default', 'Run "lint" and "test" tasks.', function() {
  this.task('lint').task('test');
});


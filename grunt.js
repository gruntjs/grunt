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
    repository: 'git://github.com/cowboy/node-grunt.git',
    banner: '/* {{meta.name}} - v{{meta.version}} - {{today "m/d/yyyy"}}\n' +
            ' * {{meta.homepage}}\n' + 
            ' * {{{meta.copyright}}}; Licensed {{join meta.license}} */'
  },
  concat: {
    'example/dist/main.js': ['<banner>', 'grunt.js', 'lib/**']
  },
  min: {
    'example/dist/min.js': ['<banner>', 'example/dist/main.js']
  },
  test: {
    files: ['test/**/*.js']
  },
  lint: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js', 'template/**/*.js'],
    built: 'example/dist/main.js'
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
      setTimeout: true, // temp hack for https://github.com/jshint/jshint/issues/292
      grequire: true,
      urequire: true,
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

// Default task.
//task.registerTask('default', 'lint:files test'); //build lint:built min');
task.registerTask('default', 'lint:files test:files concat lint:built min');

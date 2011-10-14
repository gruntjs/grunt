// Config.
config.init({
  meta: {
    name: 'project_name',
    version: '0.1.0',
    description: '',
    homepage: 'http://github.com/your_name/project',
    author: 'your_name',
    license: ['MIT', 'GPL'],
    copyright: 'Copyright (c) YYYY your_name',
    repository: 'git://github.com/your_name/project.git',
    banner: '/* {{meta.name}} - v{{meta.version}} - {{today "m/d/yyyy"}}\n' +
            ' * {{meta.homepage}}\n' + 
            ' * {{{meta.copyright}}}; Licensed {{join meta.license}} */'
  },
  concat: {
    'dist/project.js': ['<banner>', 'lib/project.js']
  },
  min: {
    'dist/project.min.js': ['<banner>', 'dist/project.js']
  },
  test: {
    files: ['test/**/*.js']
  },
  lint: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js'],
    built: 'dist/project.js'
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
      eqnull: true
    },
    globals: {
    }
  },
  uglify: {}
});

// Default task.
task.registerTask('default', 'lint:files test:files concat lint:built min');

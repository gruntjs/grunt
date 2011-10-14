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
    repository: 'git://github.com/your_name/project.git'
  },
  concat: {},
  min: {},
  test: {
    files: ['test/**/*.js']
  },
  lint: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
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
    globals: {}
  },
  uglify: {}
});

// Default task.
task.registerTask('default', 'lint:files test:files');

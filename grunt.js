config.init({
  meta: {
    name: 'grunt',
    title: 'Grunt',
    version: '0.1pre',
    description: 'A command line build tool for JavaScript projects..',
    homepage: 'http://benalman.com/',
    author: '"Cowboy" Ben Alman',
    license: ['MIT', 'GPL'],
    copyright: 'Copyright (c) 2011 "Cowboy" Ben Alman',
    repository: 'git://github.com/cowboy/node-grunt.git'
  },
  test: {
    //reporter: 'minimal',
    folders: ['test/util']
  },
  lint: {
    pre: true,
    post: true
  },
  jshint: {
    curly: true,
    eqnull: true,
    immed: true,
    newcap: true,
    noarg: true,
    undef: true,
    browser: true,
    predef: ['exports']
  }
});

task.registerTask('default', 'Default stuff.', function() {
  this.task('test');
});

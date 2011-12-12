/*global config:true, task:true*/
config.init({
  meta: {
    name: '<%PROJECTNAME%>',
    version: '0.1.0',
    description: '',
    homepage: 'http://github.com/<%GITNAME%>/<%PROJECTNAME%>',
    author: '<%USERNAME%>',
    license: ['MIT', 'GPL'],
    copyright: 'Copyright (c) <%TODAY:yyyy%> <%USERNAME%>',
    repository: 'git://github.com/<%GITNAME%>/<%PROJECTNAME%>.git',
    banner: '/* {{meta.name}} - v{{meta.version}} - {{today "m/d/yyyy"}}\n' +
            ' * {{meta.homepage}}\n' + 
            ' * {{{meta.copyright}}}; Licensed {{join meta.license}} */'
  },
  concat: {
    'dist/<%PROJECTNAME%>.js': ['<banner>', '<file_strip_banner:lib/<%PROJECTNAME%>.js>']
  },
  min: {
    'dist/<%PROJECTNAME%>.min.js': ['<banner>', 'dist/<%PROJECTNAME%>.js']
  },
  test: {
    files: ['test/**/*.js']
  },
  lint: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
  },
  watch: {
    files: '<config:lint.files>',
    tasks: 'lint:files test:files'
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
      exports: true
    }
  },
  uglify: {}
});

// Default task.
task.registerTask('default', 'lint:files test:files concat min');

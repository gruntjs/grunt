/*global module:false*/
module.exports = function(grunt) { 
  // Project configuration.
  grunt.initConfig({
    pkg : '<json:package.json>',
    meta : {
      banner : '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    coffee : {
      helpers : {
        src  : 'spec/coffeescripts/helpers/*.coffee',
        dest : 'spec/javascripts/helpers'
      },
      specs : {
        src  : 'spec/coffeescripts/*.coffee',
        dest : 'spec/javascripts'
      },
      plugin : {
        src  : 'js/*.coffee',
        dest : 'js'
      }
    },
    jasmine : {
      src     : ['js/libs/**/*.js', 'js/*[^(min)].js', 'spec/javascripts/libs/**/*.js'],
      helpers : 'spec/javascripts/helpers/**/*.js',
      specs   : 'spec/javascripts/**/*.js'
    },
    watch : {
      files: ['<config:coffee.helpers.src>', '<config:coffee.specs.src>', '<config:coffee.plugin.src>'],
      tasks: 'coffee growl:coffee jasmine growl:jasmine'
    },
    growl : {
      coffee : {
        title   : 'CoffeeScript',
        message : 'Compiled successfully'
      },
      jasmine : {
        title   : 'Jasmine',
        message : 'Tests passed successfully'
      }
    },
    min : {
      dist : {
        src  : ['<banner:meta.banner>', 'js/<%= pkg.name %>.js'],
        dest : 'js/<%= pkg.name %>.min.js'
      }
    }
  });

  // Lib tasks.
  grunt.loadNpmTasks('grunt-growl');
  grunt.loadNpmTasks('grunt-jasmine-runner');
  grunt.loadNpmTasks('grunt-coffee');

  // Default task.
  grunt.registerTask('default', 'growl coffee jasmine');  

  // Travis CI task.
  grunt.registerTask('travis', 'jasmine');
};

module.exports = function(grunt) {

  grunt.registerTask('default', function(text) {
    var done = this.async();
    grunt.util.spawn({
      grunt: true,
      args: ['--gruntfile', 'Gruntfile-execArgv-child.js'],
    }, function(err, result, code) {
      var matches = result.stdout.match(/^(OUTPUT: .*)/m);
      console.log(matches ? matches[1] : '');
      done();
    });
  });

};

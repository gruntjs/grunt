var grunt = require('../../lib/grunt');

// In case the grunt being used to test is different than the grunt being
// tested, initialize the task and config subsystems.
if (grunt.task.searchDirs.length === 0) {
  grunt.task.init([]);
  grunt.config.init({});
}

// Just tests whether options are correctly set
exports['jshint'] = function(test) {
  var expectedOutput = '';
  test.expect(1);

  var filePath = 'test/fixtures/lintTest.js',
      options = {
        asi: true,
        laxcomma: true
      },
      globals = {
        node: true
      };
      
  var output = grunt.helper('lint', grunt.file.read(filePath), options, globals);

  console.log(require('util').inspect(grunt.verbose.success));

  test.equal(grunt.fail.errorcount, 0, 'It should pass jshint test.')
  test.done();
}
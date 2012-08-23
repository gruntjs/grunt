'use strict';

var grunt = require('../../../lib/grunt');
var stripBanner = require('../../../tasks/lib/comment').stripBanner;

// In case the grunt being used to test is different than the grunt being
// tested, initialize the task and config subsystems.
if (grunt.task.searchDirs.length === 0) {
  grunt.task.init([]);
  grunt.config.init({});
}

exports['comment'] = {
  'stripBanner': function(test) {
    test.expect(7);
    var src = grunt.file.read('test/fixtures/banner.js');
    test.equal(stripBanner(src), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
    test.equal(stripBanner(src, {block: true}), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
    src = grunt.file.read('test/fixtures/banner2.js');
    test.equal(stripBanner(src), '\n/*! SAMPLE\n * BANNER */\n\n// Comment\n\n/* Comment */\n', 'It should not strip the top banner.');
    test.equal(stripBanner(src, {block: true}), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
    src = grunt.file.read('test/fixtures/banner3.js');
    test.equal(stripBanner(src), '\n// This is\n// A sample\n// Banner\n\n// But this is not\n\n/* And neither\n * is this\n */\n', 'It should not strip the top banner.');
    test.equal(stripBanner(src, {block: true}), '\n// This is\n// A sample\n// Banner\n\n// But this is not\n\n/* And neither\n * is this\n */\n', 'It should not strip the top banner.');
    test.equal(stripBanner(src, {line: true}), '// But this is not\n\n/* And neither\n * is this\n */\n', 'It should strip the top banner.');
    test.done();
  }
};

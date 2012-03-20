var grunt = require('../../lib/grunt');
var task = grunt.task;
var file = grunt.file;
var utils = grunt.utils;
var config = grunt.config;
var template = grunt.template;

exports['config'] = function(test) {
  test.expect(2);
  test.deepEqual(grunt.helper('config'), config(), 'It should just pass through to config.');
  test.deepEqual(grunt.helper('config', 'meta'), config('meta'), 'It should just pass through to config.');
  test.done();
};

exports['json'] = function(test) {
  test.expect(2);
  var obj = grunt.helper('json', 'test/fixtures/test.json');
  test.equal(obj.foo, 'bar', 'JSON properties should be available as-defined.');
  test.deepEqual(obj.baz, [1, 2, 3], 'JSON properties should be available as-defined.');
  test.done();
};

exports['strip_banner'] = function(test) {
  test.expect(7);
  var src = file.read('test/fixtures/banner.js');
  test.equal(grunt.helper('strip_banner', src), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
  test.equal(grunt.helper('strip_banner', src, {bang: true}), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
  src = file.read('test/fixtures/banner2.js');
  test.equal(grunt.helper('strip_banner', src), '\n/*! SAMPLE\n * BANNER */\n\n// Comment\n\n/* Comment */\n', 'It should not strip the top banner.');
  test.equal(grunt.helper('strip_banner', src, {bang: true}), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
  src = file.read('test/fixtures/banner3.js');
  test.equal(grunt.helper('strip_banner', src), '\n// This is\n// A sample\n// Banner\n\n// But this is not\n\n/* And neither\n * is this\n */\n', 'It should not strip the top banner.');
  test.equal(grunt.helper('strip_banner', src, {bang: true}), '\n// This is\n// A sample\n// Banner\n\n// But this is not\n\n/* And neither\n * is this\n */\n', 'It should not strip the top banner.');
  test.equal(grunt.helper('strip_banner', src, {line: true}), '// But this is not\n\n/* And neither\n * is this\n */\n', 'It should strip the top banner.');
  test.done();
};

exports['file_strip_banner'] = function(test) {
  test.expect(14);
  var filepath = 'test/fixtures/banner.js';
  test.equal(grunt.helper('file_strip_banner', filepath), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
  test.equal(grunt.helper('file_strip_banner', filepath, {bang: true}), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
  filepath = 'test/fixtures/banner2.js';
  test.equal(grunt.helper('file_strip_banner', filepath), '\n/*! SAMPLE\n * BANNER */\n\n// Comment\n\n/* Comment */\n', 'It should not strip the top banner.');
  test.equal(grunt.helper('file_strip_banner', filepath, {bang: true}), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
  filepath = 'test/fixtures/banner3.js';
  test.equal(grunt.helper('file_strip_banner', filepath), '\n// This is\n// A sample\n// Banner\n\n// But this is not\n\n/* And neither\n * is this\n */\n', 'It should not strip the top banner.');
  test.equal(grunt.helper('file_strip_banner', filepath, {bang: true}), '\n// This is\n// A sample\n// Banner\n\n// But this is not\n\n/* And neither\n * is this\n */\n', 'It should not strip the top banner.');
  test.equal(grunt.helper('file_strip_banner', filepath, {line: true}), '// But this is not\n\n/* And neither\n * is this\n */\n', 'It should strip the top banner.');

  test.equal(task.directive('<file_strip_banner:test/fixtures/banner.js>'), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
  test.equal(task.directive('<file_strip_banner:test/fixtures/banner.js:bang>'), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
  test.equal(task.directive('<file_strip_banner:test/fixtures/banner2.js>'), '\n/*! SAMPLE\n * BANNER */\n\n// Comment\n\n/* Comment */\n', 'It should not strip the top banner.');
  test.equal(task.directive('<file_strip_banner:test/fixtures/banner2.js:bang>'), '// Comment\n\n/* Comment */\n', 'It should strip the top banner.');
  test.equal(task.directive('<file_strip_banner:test/fixtures/banner3.js>'), '\n// This is\n// A sample\n// Banner\n\n// But this is not\n\n/* And neither\n * is this\n */\n', 'It should not strip the top banner.');
  test.equal(task.directive('<file_strip_banner:test/fixtures/banner3.js:bang>'), '\n// This is\n// A sample\n// Banner\n\n// But this is not\n\n/* And neither\n * is this\n */\n', 'It should not strip the top banner.');
  test.equal(task.directive('<file_strip_banner:test/fixtures/banner3.js:line>'), '// But this is not\n\n/* And neither\n * is this\n */\n', 'It should strip the top banner.');
  test.done();
};

exports['banner'] = function(test) {
  test.expect(5);
  config('test_config', {a: 'aaaaa', b: 'bbbbb', c: [1, 2, 3], d: [{a: 1}, {a: 2}, {a: 3}]});

  config('meta.banner', 'foo\n<%= test_config.a %>\nbar');
  test.equal(grunt.helper('banner'), utils.normalizelf('foo\naaaaa\nbar\n'), 'It should use the default banner.');

  config('test_config.banner', '<%= test_config.b %>');
  test.equal(grunt.helper('banner', 'test_config.banner'), utils.normalizelf('bbbbb\n'), 'It should use the requested banner.');

  config('test_config.banner', '<%= test_config.c.join(", ") %>');
  test.equal(grunt.helper('banner', 'test_config.banner'), utils.normalizelf('1, 2, 3\n'), 'It should join arrays.');

  config('test_config.banner', '<%= _.pluck(test_config.d, "a").join(", ") %>');
  test.equal(grunt.helper('banner', 'test_config.banner'), utils.normalizelf('1, 2, 3\n'), 'It should join arrays.');

  config('test_config.banner', '<%= grunt.template.today("m/d/yyyy") %>');
  test.equal(grunt.helper('banner', 'test_config.banner'), utils.normalizelf(template.today('m/d/yyyy') + '\n'), 'It should parse the current date correctly.');

  test.done();
};

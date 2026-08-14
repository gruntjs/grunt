'use strict';

var grunt = require('../../lib/grunt');

var fs = require('fs');
var path = require('path');

var Tempfile = require('temporary/lib/file');
var Tempdir = require('temporary/lib/dir');

var win32 = process.platform === 'win32';

var tmpdir = new Tempdir();
try {
  fs.symlinkSync(path.resolve('test/fixtures/octocat.png'), path.join(tmpdir.path, 'octocat.png'), 'file');
  fs.symlinkSync(path.resolve('test/fixtures/expand'), path.join(tmpdir.path, 'expand'), 'dir');
} catch (err) {
  console.error('** ERROR: Cannot create symbolic links; link-related tests will fail');
  if (win32) {
    console.error('** Tests must be run with Administrator privileges on Windows');
  }
}

QUnit.module('file.match');
QUnit.test('empty set', function(assert) {
  assert.deepEqual(grunt.file.match(null, null), []);
  assert.deepEqual(grunt.file.match({}, null, null), []);
  assert.deepEqual(grunt.file.match(null, 'foo.js'), []);
  assert.deepEqual(grunt.file.match('*.js', null), []);
  assert.deepEqual(grunt.file.match({}, null, 'foo.js'), []);
  assert.deepEqual(grunt.file.match({}, '*.js', null), []);
  assert.deepEqual(grunt.file.match({}, [], 'foo.js'), []);
  assert.deepEqual(grunt.file.match({}, '*.js', []), []);
  assert.deepEqual(grunt.file.match(null, ['foo.js']), []);
  assert.deepEqual(grunt.file.match(['*.js'], null), []);
  assert.deepEqual(grunt.file.match({}, null, ['foo.js']), []);
  assert.deepEqual(grunt.file.match({}, ['*.js'], null), []);
});
QUnit.test('basic matching', function(assert) {
  assert.deepEqual(grunt.file.match('*.js', 'foo.js'), ['foo.js']);
  assert.deepEqual(grunt.file.match('*.js', ['foo.js']), ['foo.js']);
  assert.deepEqual(grunt.file.match('*.js', ['foo.js', 'bar.css']), ['foo.js']);
  assert.deepEqual(grunt.file.match(['*.js', '*.css'], 'foo.js'), ['foo.js']);
  assert.deepEqual(grunt.file.match(['*.js', '*.css'], ['foo.js']), ['foo.js']);
  assert.deepEqual(grunt.file.match(['*.js', '*.css'], ['foo.js', 'bar.css']), ['foo.js', 'bar.css']);
});
QUnit.test('no matches', function(assert) {
  assert.deepEqual(grunt.file.match('*.js', 'foo.css'), []);
  assert.deepEqual(grunt.file.match('*.js', ['foo.css', 'bar.css']), []);
});
QUnit.test('unique', function(assert) {
  assert.deepEqual(grunt.file.match('*.js', ['foo.js', 'foo.js']), ['foo.js'], 'should return a uniqued set');
  assert.deepEqual(grunt.file.match(['*.js', '*.*'], ['foo.js', 'foo.js']), ['foo.js'], 'should return a uniqued set');
});
QUnit.test('flatten', function(assert) {
  assert.deepEqual(grunt.file.match([['*.js', '*.css'], ['*.*', '*.js']], ['foo.js', 'bar.css']), ['foo.js', 'bar.css'], 'should process nested pattern arrays correctly');
});
QUnit.test('exclusion', function(assert) {
  assert.deepEqual(grunt.file.match(['!*.js'], ['foo.js', 'bar.js']), [], 'solitary exclusion should match nothing');
  assert.deepEqual(grunt.file.match(['*.js', '!*.js'], ['foo.js', 'bar.js']), [], 'exclusion should cancel match');
  assert.deepEqual(grunt.file.match(['*.js', '!f*.js'], ['foo.js', 'bar.js', 'baz.js']), ['bar.js', 'baz.js'], 'partial exclusion should partially cancel match');
  assert.deepEqual(grunt.file.match(['*.js', '!*.js', 'b*.js'], ['foo.js', 'bar.js', 'baz.js']), ['bar.js', 'baz.js'], 'inclusion / exclusion order matters');
  assert.deepEqual(grunt.file.match(['*.js', '!f*.js', '*.js'], ['foo.js', 'bar.js', 'baz.js']), ['bar.js', 'baz.js', 'foo.js'], 'inclusion / exclusion order matters');
});
QUnit.test('options.matchBase', function(assert) {
  assert.deepEqual(grunt.file.match({matchBase: true}, '*.js', ['foo.js', 'bar', 'baz/xyz.js']), ['foo.js', 'baz/xyz.js'], 'should matchBase (minimatch) when specified');
  assert.deepEqual(grunt.file.match('*.js', ['foo.js', 'bar', 'baz/xyz.js']), ['foo.js'], 'should not matchBase (minimatch) by default');
});

QUnit.module('file.isMatch');
QUnit.test('basic matching', function(assert) {
  assert.true(grunt.file.isMatch('*.js', 'foo.js'));
  assert.true(grunt.file.isMatch('*.js', ['foo.js']));
  assert.true(grunt.file.isMatch('*.js', ['foo.js', 'bar.css']));
  assert.true(grunt.file.isMatch(['*.js', '*.css'], 'foo.js'));
  assert.true(grunt.file.isMatch(['*.js', '*.css'], ['foo.js']));
  assert.true(grunt.file.isMatch(['*.js', '*.css'], ['foo.js', 'bar.css']));
});
QUnit.test('no matches', function(assert) {
  assert.false(grunt.file.isMatch('*.js', 'foo.css'));
  assert.false(grunt.file.isMatch('*.js', ['foo.css', 'bar.css']));
  assert.false(grunt.file.isMatch(null, 'foo.css'));
  assert.false(grunt.file.isMatch('*.js', null));
  assert.false(grunt.file.isMatch([], 'foo.css'));
  assert.false(grunt.file.isMatch('*.js', []));
});
QUnit.test('options.matchBase', function(assert) {
  assert.true(grunt.file.isMatch({matchBase: true}, '*.js', ['baz/xyz.js']), 'should matchBase (minimatch) when specified');
  assert.false(grunt.file.isMatch('*.js', ['baz/xyz.js']), 'should not matchBase (minimatch) by default');
});

QUnit.module('file.expand', {
  beforeEach: function() {
    this.cwd = process.cwd();
    process.chdir('test/fixtures/expand');
  },
  afterEach: function() {
    process.chdir(this.cwd);
  }
});
QUnit.test('basic matching', function(assert) {
  assert.deepEqual(grunt.file.expand('**/*.js'), ['js/bar.js', 'js/foo.js'], 'should match');
  assert.deepEqual(grunt.file.expand('**/*.js', '**/*.css'), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match');
  assert.deepEqual(grunt.file.expand(['**/*.js', '**/*.css']), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match');
  assert.deepEqual(grunt.file.expand('**d*/**'), [
    'deep',
    'deep/deep.txt',
    'deep/deeper',
    'deep/deeper/deeper.txt',
    'deep/deeper/deepest',
    'deep/deeper/deepest/deepest.txt'], 'should match files and directories');
  assert.deepEqual(grunt.file.expand({mark: true}, '**d*/**'), [
    'deep/',
    'deep/deep.txt',
    'deep/deeper/',
    'deep/deeper/deeper.txt',
    'deep/deeper/deepest/',
    'deep/deeper/deepest/deepest.txt'], 'the minimatch "mark" option ensures directories end in /');
  assert.deepEqual(grunt.file.expand('**d*/**/'), [
    'deep/',
    'deep/deeper/',
    'deep/deeper/deepest/'], 'should match directories, arbitrary / at the end appears in matches');
  assert.deepEqual(grunt.file.expand({mark: true}, '**d*/**/'), [
    'deep/',
    'deep/deeper/',
    'deep/deeper/deepest/'], 'should match directories, arbitrary / at the end appears in matches');
  assert.deepEqual(grunt.file.expand('*.xyz'), []);
});
QUnit.test('filter', function(assert) {
  assert.deepEqual(grunt.file.expand({filter: 'isFile'}, '**d*/**'), [
    'deep/deep.txt',
    'deep/deeper/deeper.txt',
    'deep/deeper/deepest/deepest.txt'
  ], 'should match files only');
  assert.deepEqual(grunt.file.expand({filter: 'isDirectory'}, '**d*/**'), [
    'deep',
    'deep/deeper',
    'deep/deeper/deepest'
  ], 'should match directories only');
  assert.deepEqual(grunt.file.expand({filter: function(filepath) { return (/deepest/).test(filepath); }}, '**'), [
    'deep/deeper/deepest',
    'deep/deeper/deepest/deepest.txt',
  ], 'should filter arbitrarily');
  assert.deepEqual(grunt.file.expand({filter: 'isFile'}, 'js', 'css'), []);
  assert.deepEqual(grunt.file.expand({filter: 'isDirectory'}, '**/*.js'), []);
});
QUnit.test('unique', function(assert) {
  assert.deepEqual(grunt.file.expand('**/*.js', 'js/*.js'), ['js/bar.js', 'js/foo.js'], 'file list should be uniqed');
  assert.deepEqual(grunt.file.expand('**/*.js', '**/*.css', 'js/*.js'), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'file list should be uniqed');
  assert.deepEqual(grunt.file.expand('js', 'js/'), ['js', 'js/'], 'mixed non-ending-/ and ending-/ dirs will not be uniqed by default');
  assert.deepEqual(grunt.file.expand({mark: true}, 'js', 'js/'), ['js/'], 'mixed non-ending-/ and ending-/ dirs will be uniqed when "mark" is specified');
});
QUnit.test('file order', function(assert) {
  var actual = grunt.file.expand('**/*.{js,css}');
  var expected = ['css/baz.css', 'css/qux.css', 'js/bar.js', 'js/foo.js'];
  assert.deepEqual(actual, expected, 'should select 4 files in this order, by default');

  actual = grunt.file.expand('js/foo.js', 'js/bar.js', '**/*.{js,css}');
  expected = ['js/foo.js', 'js/bar.js', 'css/baz.css', 'css/qux.css'];
  assert.deepEqual(actual, expected, 'specifically-specified-up-front file order should be maintained');

  actual = grunt.file.expand('js/bar.js', 'js/foo.js', '**/*.{js,css}');
  expected = ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'];
  assert.deepEqual(actual, expected, 'specifically-specified-up-front file order should be maintained');

  actual = grunt.file.expand('js/foo.js', '**/*.{js,css}', '!js/bar.js', 'js/bar.js');
  expected = ['js/foo.js', 'css/baz.css', 'css/qux.css', 'js/bar.js'];
  assert.deepEqual(actual, expected, 'if a file is excluded and then re-added, it should be added at the end');
});
QUnit.test('flatten', function(assert) {
  assert.deepEqual(grunt.file.expand([['**/*.js'], ['**/*.css', 'js/*.js']]), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match');
});
QUnit.test('exclusion', function(assert) {
  assert.deepEqual(grunt.file.expand(['!js/*.js']), [], 'solitary exclusion should match nothing');
  assert.deepEqual(grunt.file.expand(['js/bar.js', '!js/bar.js']), [], 'exclusion should cancel match');
  assert.deepEqual(grunt.file.expand(['**/*.js', '!js/foo.js']), ['js/bar.js'], 'should omit single file from matched set');
  assert.deepEqual(grunt.file.expand(['!js/foo.js', '**/*.js']), ['js/bar.js', 'js/foo.js'], 'inclusion / exclusion order matters');
  assert.deepEqual(grunt.file.expand(['**/*.js', '**/*.css', '!js/bar.js', '!css/baz.css']), ['js/foo.js', 'css/qux.css'], 'multiple exclusions should be removed from the set');
  assert.deepEqual(grunt.file.expand(['**/*.js', '**/*.css', '!**/*.css']), ['js/bar.js', 'js/foo.js'], 'excluded wildcards should be removed from the matched set');
  assert.deepEqual(grunt.file.expand(['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css', '!**/b*.*']), ['js/foo.js', 'css/qux.css'], 'different pattern for exclusion should still work');
  assert.deepEqual(grunt.file.expand(['js/bar.js', '!**/b*.*', 'js/foo.js', 'css/baz.css', 'css/qux.css']), ['js/foo.js', 'css/baz.css', 'css/qux.css'], 'inclusion / exclusion order matters');
});
QUnit.test('options.matchBase', function(assert) {
  var opts = {matchBase: true};
  assert.deepEqual(grunt.file.expand('*.js'), [], 'should not matchBase (minimatch) by default');
  assert.deepEqual(grunt.file.expand(opts, '*.js'), ['js/bar.js', 'js/foo.js'], 'options should be passed through to minimatch');
  assert.deepEqual(grunt.file.expand(opts, '*.js', '*.css'), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match');
  assert.deepEqual(grunt.file.expand(opts, ['*.js', '*.css']), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match');
});
QUnit.test('options.cwd', function(assert) {
  var cwd = path.resolve(process.cwd(), '..');
  assert.deepEqual(grunt.file.expand({cwd: cwd}, ['expand/js', 'expand/js/*']), ['expand/js', 'expand/js/bar.js', 'expand/js/foo.js'], 'should match');
  assert.deepEqual(grunt.file.expand({cwd: cwd, filter: 'isFile'}, ['expand/js', 'expand/js/*']), ['expand/js/bar.js', 'expand/js/foo.js'], 'should match');
  assert.deepEqual(grunt.file.expand({cwd: cwd, filter: 'isDirectory'}, ['expand/js', 'expand/js/*']), ['expand/js'], 'should match');
  assert.deepEqual(grunt.file.expand({cwd: cwd, filter: 'isFile'}, ['expand/js', 'expand/js/*', '!**/b*.js']), ['expand/js/foo.js'], 'should negate properly');
});
QUnit.test('options.nonull', function(assert) {
  var opts = {nonull: true};
  assert.deepEqual(grunt.file.expand(opts, ['js/a*', 'js/b*', 'js/c*']), ['js/a*', 'js/bar.js', 'js/c*'], 'non-matching patterns should be returned in result set');
  assert.deepEqual(grunt.file.expand(opts, ['js/foo.js', 'js/bar.js', 'js/baz.js']), ['js/foo.js', 'js/bar.js', 'js/baz.js'], 'non-matching filenames should be returned in result set');
});

QUnit.module('file.expandMapping', {
  beforeEach: function() {
    this.cwd = process.cwd();
    process.chdir('test/fixtures');
  },
  afterEach: function() {
    process.chdir(this.cwd);
  }
});
QUnit.test('basic matching', function(assert) {
  var actual = grunt.file.expandMapping(['expand/**/*.txt'], 'dest');
  var expected = [
    {dest: 'dest/expand/deep/deep.txt', src: ['expand/deep/deep.txt']},
    {dest: 'dest/expand/deep/deeper/deeper.txt', src: ['expand/deep/deeper/deeper.txt']},
    {dest: 'dest/expand/deep/deeper/deepest/deepest.txt', src: ['expand/deep/deeper/deepest/deepest.txt']},
  ];
  assert.deepEqual(actual, expected, 'basic src-dest options');

  actual = grunt.file.expandMapping(['expand/**/*.txt'], 'dest/');
  assert.deepEqual(actual, expected, 'destBase should behave the same both with or without trailing slash');
});
QUnit.test('flatten', function(assert) {
  var actual = grunt.file.expandMapping(['expand/**/*.txt'], 'dest', {flatten: true});
  var expected = [
    {dest: 'dest/deep.txt', src: ['expand/deep/deep.txt']},
    {dest: 'dest/deeper.txt', src: ['expand/deep/deeper/deeper.txt']},
    {dest: 'dest/deepest.txt', src: ['expand/deep/deeper/deepest/deepest.txt']},
  ];
  assert.deepEqual(actual, expected, 'dest paths should be flattened pre-destBase+destPath join');
});
QUnit.test('ext', function(assert) {
  var actual, expected;
  actual = grunt.file.expandMapping(['expand/**/*.txt'], 'dest', {ext: '.foo'});
  expected = [
    {dest: 'dest/expand/deep/deep.foo', src: ['expand/deep/deep.txt']},
    {dest: 'dest/expand/deep/deeper/deeper.foo', src: ['expand/deep/deeper/deeper.txt']},
    {dest: 'dest/expand/deep/deeper/deepest/deepest.foo', src: ['expand/deep/deeper/deepest/deepest.txt']},
  ];
  assert.deepEqual(actual, expected, 'specified extension should be added');
  actual = grunt.file.expandMapping(['expand-mapping-ext/**/file*'], 'dest', {ext: '.foo'});
  expected = [
    {dest: 'dest/expand-mapping-ext/dir.ectory/file-no-extension.foo', src: ['expand-mapping-ext/dir.ectory/file-no-extension']},
    {dest: 'dest/expand-mapping-ext/dir.ectory/sub.dir.ectory/file.foo', src: ['expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.ension']},
    {dest: 'dest/expand-mapping-ext/file.foo', src: ['expand-mapping-ext/file.ext.ension']},
  ];
  assert.deepEqual(actual, expected, 'specified extension should be added');
  actual = grunt.file.expandMapping(['expand/**/*.txt'], 'dest', {ext: ''});
  expected = [
    {dest: 'dest/expand/deep/deep', src: ['expand/deep/deep.txt']},
    {dest: 'dest/expand/deep/deeper/deeper', src: ['expand/deep/deeper/deeper.txt']},
    {dest: 'dest/expand/deep/deeper/deepest/deepest', src: ['expand/deep/deeper/deepest/deepest.txt']},
  ];
  assert.deepEqual(actual, expected, 'empty string extension should be added');
});
QUnit.test('extDot', function(assert) {
  var actual, expected;

  actual = grunt.file.expandMapping(['expand-mapping-ext/**/file*'], 'dest', {ext: '.foo', extDot: 'first'});
  expected = [
    {dest: 'dest/expand-mapping-ext/dir.ectory/file-no-extension.foo', src: ['expand-mapping-ext/dir.ectory/file-no-extension']},
    {dest: 'dest/expand-mapping-ext/dir.ectory/sub.dir.ectory/file.foo', src: ['expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.ension']},
    {dest: 'dest/expand-mapping-ext/file.foo', src: ['expand-mapping-ext/file.ext.ension']},
  ];
  assert.deepEqual(actual, expected, 'extDot of "first" should replace everything after the first dot in the filename');

  actual = grunt.file.expandMapping(['expand-mapping-ext/**/file*'], 'dest', {ext: '.foo', extDot: 'last'});
  expected = [
    {dest: 'dest/expand-mapping-ext/dir.ectory/file-no-extension.foo', src: ['expand-mapping-ext/dir.ectory/file-no-extension']},
    {dest: 'dest/expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.foo', src: ['expand-mapping-ext/dir.ectory/sub.dir.ectory/file.ext.ension']},
    {dest: 'dest/expand-mapping-ext/file.ext.foo', src: ['expand-mapping-ext/file.ext.ension']},
  ];
  assert.deepEqual(actual, expected, 'extDot of "last" should replace everything after the last dot in the filename');
});
QUnit.test('cwd', function(assert) {
  var actual = grunt.file.expandMapping(['**/*.txt'], 'dest', {cwd: 'expand'});
  var expected = [
    {dest: 'dest/deep/deep.txt', src: ['expand/deep/deep.txt']},
    {dest: 'dest/deep/deeper/deeper.txt', src: ['expand/deep/deeper/deeper.txt']},
    {dest: 'dest/deep/deeper/deepest/deepest.txt', src: ['expand/deep/deeper/deepest/deepest.txt']},
  ];
  assert.deepEqual(actual, expected, 'cwd should be stripped from front of destPath, pre-destBase+destPath join');
});
QUnit.test('rename', function(assert) {
  var actual = grunt.file.expandMapping(['**/*.txt'], 'dest', {
    cwd: 'expand',
    flatten: true,
    rename: function(destBase, destPath, options) {
      return path.join(destBase, options.cwd, 'o-m-g', destPath);
    }
  });
  var expected = [
    {dest: 'dest/expand/o-m-g/deep.txt', src: ['expand/deep/deep.txt']},
    {dest: 'dest/expand/o-m-g/deeper.txt', src: ['expand/deep/deeper/deeper.txt']},
    {dest: 'dest/expand/o-m-g/deepest.txt', src: ['expand/deep/deeper/deepest/deepest.txt']},
  ];
  assert.deepEqual(actual, expected, 'custom rename function should be used to build dest, post-flatten');
});
QUnit.test('rename to same dest', function(assert) {
  var actual = grunt.file.expandMapping(['**/*'], 'dest', {
    filter: 'isFile',
    cwd: 'expand',
    flatten: true,
    nosort: true,
    rename: function(destBase, destPath) {
      return path.join(destBase, 'all' + path.extname(destPath));
    }
  });
  var expected = [
    {dest: 'dest/all.md', src: ['expand/README.md']},
    {dest: 'dest/all.css', src: ['expand/css/baz.css', 'expand/css/qux.css']},
    {dest: 'dest/all.txt', src: ['expand/deep/deep.txt', 'expand/deep/deeper/deeper.txt', 'expand/deep/deeper/deepest/deepest.txt']},
    {dest: 'dest/all.js', src: ['expand/js/bar.js', 'expand/js/foo.js']},
  ];
  assert.deepEqual(actual, expected, 'if dest is same for multiple src, create an array of src');
});

// Compare two buffers. Returns true if they are equivalent.
function compareBuffers(buf1, buf2) {
  if (!Buffer.isBuffer(buf1) || !Buffer.isBuffer(buf2)) { return false; }
  if (buf1.length !== buf2.length) { return false; }
  for (var i = 0; i < buf2.length; i++) {
    if (buf1[i] !== buf2[i]) { return false; }
  }
  return true;
}

// Compare two files. Returns true if they are equivalent.
function compareFiles(filepath1, filepath2) {
  return compareBuffers(fs.readFileSync(filepath1), fs.readFileSync(filepath2));
}

QUnit.module('file', {
  beforeEach: function() {
    this.defaultEncoding = grunt.file.defaultEncoding;
    grunt.file.defaultEncoding = 'utf8';
    this.string = 'Ação é isso aí\n';
    this.object = {foo: 'Ação é isso aí', bar: ['ømg', 'pønies']};
    this.writeOption = grunt.option('write');

    // Testing that warnings were displayed.
    this.oldFailWarnFn = grunt.fail.warn;
    this.oldLogWarnFn = grunt.log.warn;
    this.resetWarnCount = () => {
      this.warnCount = 0;
    };
    grunt.fail.warn = grunt.log.warn = () => {
      this.warnCount += 1;
    };
  },
  afterEach: function() {
    grunt.file.defaultEncoding = this.defaultEncoding;
    grunt.option('write', this.writeOption);

    grunt.fail.warn = this.oldFailWarnFn;
    grunt.log.warn = this.oldLogWarnFn;
  }
});
QUnit.test('read', function(assert) {
  assert.strictEqual(grunt.file.read('test/fixtures/utf8.txt'), this.string, 'file should be read as utf8 by default');
  assert.strictEqual(grunt.file.read('test/fixtures/iso-8859-1.txt', {encoding: 'iso-8859-1'}), this.string, 'file should be read using the specified encoding');
  assert.true(compareBuffers(grunt.file.read('test/fixtures/octocat.png', {encoding: null}), fs.readFileSync('test/fixtures/octocat.png')), 'file should be read as a buffer if encoding is specified as null');

  assert.strictEqual(grunt.file.read('test/fixtures/BOM.txt'), 'foo', 'file should have BOM stripped');
  grunt.file.preserveBOM = true;
  assert.strictEqual(grunt.file.read('test/fixtures/BOM.txt'), '\ufeff' + 'foo', 'file should have BOM preserved');
  grunt.file.preserveBOM = false;

  grunt.file.defaultEncoding = 'iso-8859-1';
  assert.strictEqual(grunt.file.read('test/fixtures/iso-8859-1.txt'), this.string, 'changing the default encoding should work');
});
QUnit.test('readJSON', function(assert) {
  var obj;
  obj = grunt.file.readJSON('test/fixtures/utf8.json');
  assert.deepEqual(obj, this.object, 'file should be read as utf8 by default and parsed correctly');

  obj = grunt.file.readJSON('test/fixtures/iso-8859-1.json', {encoding: 'iso-8859-1'});
  assert.deepEqual(obj, this.object, 'file should be read using the specified encoding');

  grunt.file.defaultEncoding = 'iso-8859-1';
  obj = grunt.file.readJSON('test/fixtures/iso-8859-1.json');
  assert.deepEqual(obj, this.object, 'changing the default encoding should work');
});
QUnit.test('readYAML', function(assert) {
  var obj;
  obj = grunt.file.readYAML('test/fixtures/utf8.yaml');
  assert.deepEqual(obj, this.object, 'file should be safely read as utf8 by default and parsed correctly');

  obj = grunt.file.readYAML('test/fixtures/utf8.yaml', null, {unsafeLoad: true});
  assert.deepEqual(obj, this.object, 'file should be unsafely read as utf8 by default and parsed correctly');

  obj = grunt.file.readYAML('test/fixtures/iso-8859-1.yaml', {encoding: 'iso-8859-1'});
  assert.deepEqual(obj, this.object, 'file should be read using the specified encoding');

  assert.throws(function() {
    obj = grunt.file.readYAML('test/fixtures/error.yaml');
  }, function(err) {
    return err.message.indexOf('undefined') === -1;
  }, 'error thrown should not contain undefined');

  grunt.file.defaultEncoding = 'iso-8859-1';
  obj = grunt.file.readYAML('test/fixtures/iso-8859-1.yaml');
  assert.deepEqual(obj, this.object, 'changing the default encoding should work');
});
QUnit.test('write', function(assert) {
  var tmpfile;
  tmpfile = new Tempfile();
  grunt.file.write(tmpfile.path, this.string);
  assert.strictEqual(fs.readFileSync(tmpfile.path, 'utf8'), this.string, 'file should be written as utf8 by default');
  tmpfile.unlinkSync();

  tmpfile = new Tempfile();
  grunt.file.write(tmpfile.path, this.string, {encoding: 'iso-8859-1'});
  assert.strictEqual(grunt.file.read(tmpfile.path, {encoding: 'iso-8859-1'}), this.string, 'file should be written using the specified encoding');
  tmpfile.unlinkSync();

  tmpfile = new Tempfile();
  tmpfile.unlinkSync();
  grunt.file.write(tmpfile.path, this.string, {mode: parseInt('0444', 8)});
  assert.strictEqual(fs.statSync(tmpfile.path).mode & parseInt('0222', 8), 0, 'file should be read only');
  fs.chmodSync(tmpfile.path, parseInt('0666', 8));
  tmpfile.unlinkSync();

  grunt.file.defaultEncoding = 'iso-8859-1';
  tmpfile = new Tempfile();
  grunt.file.write(tmpfile.path, this.string);
  grunt.file.defaultEncoding = 'utf8';
  assert.strictEqual(grunt.file.read(tmpfile.path, {encoding: 'iso-8859-1'}), this.string, 'changing the default encoding should work');
  tmpfile.unlinkSync();

  tmpfile = new Tempfile();
  var octocat = fs.readFileSync('test/fixtures/octocat.png');
  grunt.file.write(tmpfile.path, octocat);
  assert.true(compareBuffers(fs.readFileSync(tmpfile.path), octocat), 'buffers should always be written as-specified, with no attempt at re-encoding');
  tmpfile.unlinkSync();

  grunt.option('write', false);
  var filepath = path.join(tmpdir.path, 'should-not-exist.txt');
  grunt.file.write(filepath, 'test');
  assert.false(grunt.file.exists(filepath), 'file should NOT be created if --no-write was specified');
});
QUnit.test('copy', function(assert) {
  var tmpfile;
  tmpfile = new Tempfile();
  grunt.file.copy('test/fixtures/utf8.txt', tmpfile.path);
  assert.true(compareFiles(tmpfile.path, 'test/fixtures/utf8.txt'), 'files should just be copied as encoding-agnostic by default');
  tmpfile.unlinkSync();

  tmpfile = new Tempfile();
  grunt.file.copy('test/fixtures/iso-8859-1.txt', tmpfile.path);
  assert.true(compareFiles(tmpfile.path, 'test/fixtures/iso-8859-1.txt'), 'files should just be copied as encoding-agnostic by default');
  tmpfile.unlinkSync();

  tmpfile = new Tempfile();
  grunt.file.copy('test/fixtures/octocat.png', tmpfile.path);
  assert.true(compareFiles(tmpfile.path, 'test/fixtures/octocat.png'), 'files should just be copied as encoding-agnostic by default');
  tmpfile.unlinkSync();

  grunt.option('write', false);
  var filepath = path.join(tmpdir.path, 'should-not-exist.txt');
  grunt.file.copy('test/fixtures/utf8.txt', filepath);
  assert.false(grunt.file.exists(filepath), 'file should NOT be created if --no-write was specified');
});

// TODO: Refactor to avoid nested assertions
QUnit.test('copy and process', function(assert) {
  var tmpfile;
  tmpfile = new Tempfile();
  grunt.file.copy('test/fixtures/utf8.txt', tmpfile.path, {
    process: function(src, srcpath, destpath) {
      assert.equal(srcpath, 'test/fixtures/utf8.txt', 'srcpath should be passed in, as-specified');
      assert.equal(destpath, tmpfile.path, 'destpath should be passed in, as-specified');
      assert.false(Buffer.isBuffer(src), 'when no encoding is specified, use default encoding and process src as a string');
      assert.equal(typeof src, 'string', 'when no encoding is specified, use default encoding and process src as a string');
      return 'føø' + src + 'bår';
    }
  });
  assert.equal(grunt.file.read(tmpfile.path), 'føø' + this.string + 'bår', 'file should be saved as properly encoded processed string');
  tmpfile.unlinkSync();

  tmpfile = new Tempfile();
  grunt.file.copy('test/fixtures/iso-8859-1.txt', tmpfile.path, {
    encoding: 'iso-8859-1',
    process: function(src) {
      assert.false(Buffer.isBuffer(src), 'use specified encoding and process src as a string');
      assert.equal(typeof src, 'string', 'use specified encoding and process src as a string');
      return 'føø' + src + 'bår';
    }
  });
  assert.equal(grunt.file.read(tmpfile.path, {encoding: 'iso-8859-1'}), 'føø' + this.string + 'bår', 'file should be saved as properly encoded processed string');
  tmpfile.unlinkSync();

  tmpfile = new Tempfile();
  grunt.file.copy('test/fixtures/utf8.txt', tmpfile.path, {
    encoding: null,
    process: function(src) {
      assert.true(Buffer.isBuffer(src), 'when encoding is specified as null, process src as a buffer');
      return Buffer.from('føø' + src.toString() + 'bår');
    }
  });
  assert.equal(grunt.file.read(tmpfile.path), 'føø' + this.string + 'bår', 'file should be saved as the buffer returned by process');
  tmpfile.unlinkSync();

  grunt.file.defaultEncoding = 'iso-8859-1';
  tmpfile = new Tempfile();
  grunt.file.copy('test/fixtures/iso-8859-1.txt', tmpfile.path, {
    process: function(src) {
      assert.false(Buffer.isBuffer(src), 'use non-utf8 default encoding and process src as a string');
      assert.equal(typeof src, 'string', 'use non-utf8 default encoding and process src as a string');
      return 'føø' + src + 'bår';
    }
  });
  assert.equal(grunt.file.read(tmpfile.path), 'føø' + this.string + 'bår', 'file should be saved as properly encoded processed string');
  tmpfile.unlinkSync();

  var filepath = path.join(tmpdir.path, 'should-not-exist.txt');
  grunt.file.copy('test/fixtures/iso-8859-1.txt', filepath, {
    process: function() {
      return false;
    }
  });
  assert.false(grunt.file.exists(filepath), 'file should NOT be created if process returns false');
});
QUnit.test('copy and process, noprocess', function(assert) {
  var tmpfile;
  tmpfile = new Tempfile();
  grunt.file.copy('test/fixtures/utf8.txt', tmpfile.path, {
    noProcess: true,
    process: function(src) {
      return 'føø' + src + 'bår';
    }
  });
  assert.equal(grunt.file.read(tmpfile.path), this.string, 'file should not have been processed');
  tmpfile.unlinkSync();

  ['process', 'noprocess', 'othernoprocess'].forEach(function(filename) {
    var filepath = path.join(tmpdir.path, filename);
    grunt.file.copy('test/fixtures/utf8.txt', filepath);
    var tmpfile = new Tempfile();
    grunt.file.copy(filepath, tmpfile.path, {
      noProcess: ['**/*no*'],
      process: function(src) {
        return 'føø' + src + 'bår';
      }
    });
    if (filename === 'process') {
      assert.equal(grunt.file.read(tmpfile.path), 'føø' + this.string + 'bår', 'file should have been processed');
    } else {
      assert.equal(grunt.file.read(tmpfile.path), this.string, 'file should not have been processed');
    }
    tmpfile.unlinkSync();
  }, this);
});
QUnit.test('copy directory recursively', function(assert) {
  var copyroot1 = path.join(tmpdir.path, 'copy-dir-1');
  var copyroot2 = path.join(tmpdir.path, 'copy-dir-2');
  grunt.file.copy('test/fixtures/expand/', copyroot1);
  grunt.file.recurse('test/fixtures/expand/', function(srcpath, rootdir, subdir, filename) {
    var destpath = path.join(copyroot1, subdir || '', filename);
    assert.true(grunt.file.isFile(srcpath), 'file should have been copied');
    assert.equal(grunt.file.read(srcpath), grunt.file.read(destpath), 'file contents should be the same');
  });
  grunt.file.mkdir(path.join(copyroot1, 'empty'));
  grunt.file.mkdir(path.join(copyroot1, 'deep/deeper/empty'));
  grunt.file.copy(copyroot1, copyroot2, {
    process: function(contents) {
      return '<' + contents + '>';
    },
  });
  assert.true(grunt.file.isDir(path.join(copyroot2, 'empty')), 'empty directory should have been created');
  assert.true(grunt.file.isDir(path.join(copyroot2, 'deep/deeper/empty')), 'empty directory should have been created');
  grunt.file.recurse('test/fixtures/expand/', function(srcpath, rootdir, subdir, filename) {
    var destpath = path.join(copyroot2, subdir || '', filename);
    assert.true(grunt.file.isFile(srcpath), 'file should have been copied');
    assert.equal('<' + grunt.file.read(srcpath) + '>', grunt.file.read(destpath), 'file contents should be processed correctly');
  });
});
QUnit.test('delete', function(assert) {
  var oldBase = process.cwd();
  var cwd = path.resolve(tmpdir.path, 'delete', 'folder');
  grunt.file.mkdir(cwd);
  grunt.file.setBase(tmpdir.path);

  grunt.file.write(path.join(cwd, 'test.js'), 'var test;');
  assert.true(grunt.file.delete(cwd), 'delete return value');
  assert.false(grunt.file.exists(cwd), 'exits return value');
  grunt.file.setBase(oldBase);
});
QUnit.test('delete nonexistent file', function(assert) {
  this.resetWarnCount();
  assert.false(grunt.file.delete('nonexistent'), 'should return false if file does not exist');
  assert.strictEqual(this.warnCount, 1, 'warning when deleting non-existent file');
});
QUnit.test('delete outside working directory', function(assert) {
  var oldBase = process.cwd();
  var cwd = path.resolve(tmpdir.path, 'delete', 'folder');
  var outsidecwd = path.resolve(tmpdir.path, 'delete', 'outsidecwd');
  grunt.file.mkdir(cwd);
  grunt.file.mkdir(outsidecwd);
  grunt.file.setBase(cwd);

  grunt.file.write(path.join(outsidecwd, 'test.js'), 'var test;');

  this.resetWarnCount();
  assert.false(grunt.file.delete(path.join(outsidecwd, 'test.js')), 'not delete anything outside the cwd');
  assert.strictEqual(this.warnCount, 1, 'warning when deleting outside working directory');

  assert.true(grunt.file.delete(path.join(outsidecwd), {force: true}), 'delete outside cwd when using the --force');
  assert.false(grunt.file.exists(outsidecwd), 'file outside cwd deleted when using the --force');

  grunt.file.setBase(oldBase);
});
QUnit.test('dont delete current working directory', function(assert) {
  var oldBase = process.cwd();
  var cwd = path.resolve(tmpdir.path, 'dontdelete', 'folder');
  grunt.file.mkdir(cwd);
  grunt.file.setBase(cwd);

  this.resetWarnCount();
  assert.false(grunt.file.delete(cwd), 'should not delete the cwd');
  assert.strictEqual(this.warnCount, 1, 'warning when trying to delete cwd');

  assert.true(grunt.file.exists(cwd), 'the cwd should exist');

  grunt.file.setBase(oldBase);
});
QUnit.test('dont actually delete with no-write option on', function(assert) {
  grunt.option('write', false);

  var oldBase = process.cwd();
  var cwd = path.resolve(tmpdir.path, 'dontdelete', 'folder');
  grunt.file.mkdir(cwd);
  grunt.file.setBase(tmpdir.path);

  grunt.file.write(path.join(cwd, 'test.js'), 'var test;');
  assert.true(grunt.file.delete(cwd), 'return true after not actually deleting file');
  assert.true(grunt.file.exists(cwd), 'file NOT be deleted if --no-write was specified');
  grunt.file.setBase(oldBase);
});
QUnit.test('mkdir', function(assert) {
  // Should not explode if the directory already exists'
  grunt.file.mkdir(tmpdir.path);
  assert.true(fs.existsSync(tmpdir.path), 'path should still exist');

  // Should also not explode, otherwise
  grunt.file.mkdir(path.join(tmpdir.path, 'aa/bb/cc'));
  assert.ok(path.join(tmpdir.path, 'aa/bb/cc'), 'path should have been created');

  fs.writeFileSync(path.join(tmpdir.path, 'aa/bb/xx'), 'test');
  assert.throws(function() {
    grunt.file.mkdir(path.join(tmpdir.path, 'aa/bb/xx/yy'));
  }, 'throw if a path cannot be created (ENOTDIR).');
});
QUnit.test('recurse', function(assert) {
  var rootdir = 'test/fixtures/expand';
  var expected = {};
  expected[rootdir + '/css/baz.css'] = [rootdir, 'css', 'baz.css'];
  expected[rootdir + '/css/qux.css'] = [rootdir, 'css', 'qux.css'];
  expected[rootdir + '/deep/deep.txt'] = [rootdir, 'deep', 'deep.txt'];
  expected[rootdir + '/deep/deeper/deeper.txt'] = [rootdir, 'deep/deeper', 'deeper.txt'];
  expected[rootdir + '/deep/deeper/deepest/deepest.txt'] = [rootdir, 'deep/deeper/deepest', 'deepest.txt'];
  expected[rootdir + '/js/bar.js'] = [rootdir, 'js', 'bar.js'];
  expected[rootdir + '/js/foo.js'] = [rootdir, 'js', 'foo.js'];
  expected[rootdir + '/README.md'] = [rootdir, undefined, 'README.md'];

  var actual = {};
  grunt.file.recurse(rootdir, function(abspath, rootdir, subdir, filename) {
    actual[abspath] = [rootdir, subdir, filename];
  });

  assert.deepEqual(actual, expected, 'paths and arguments should match');
});
QUnit.test('exists', function(assert) {
  assert.true(grunt.file.exists('test/fixtures/octocat.png'), 'files exist');
  assert.true(grunt.file.exists('test', 'fixtures', 'octocat.png'), 'should work for paths in parts');
  assert.true(grunt.file.exists('test/fixtures'), 'directories exist');
  assert.true(grunt.file.exists(path.join(tmpdir.path, 'octocat.png')), 'file links exist');
  assert.true(grunt.file.exists(path.join(tmpdir.path, 'expand')), 'directory links exist');
  assert.false(grunt.file.exists('test/fixtures/does/not/exist'), 'nonexistent files do not exist');
});
QUnit.test('isLink', function(assert) {
  assert.false(grunt.file.isLink('test/fixtures/octocat.png'), 'files are not links');
  assert.false(grunt.file.isLink('test/fixtures'), 'directories are not links');
  assert.true(grunt.file.isLink(path.join(tmpdir.path, 'octocat.png')), 'file links are links');
  assert.true(grunt.file.isLink(path.join(tmpdir.path, 'expand')), 'directory links are links');
  grunt.file.mkdir(path.join(tmpdir.path, 'relative-links'));
  fs.symlinkSync('test/fixtures/octocat.png', path.join(tmpdir.path, 'relative-links/octocat.png'), 'file');
  fs.symlinkSync('test/fixtures/expand', path.join(tmpdir.path, 'relative-links/expand'), 'file');
  assert.true(grunt.file.isLink(path.join(tmpdir.path, 'relative-links/octocat.png')), 'relative file links are links');
  assert.true(grunt.file.isLink(path.join(tmpdir.path, 'relative-links/expand')), 'relative directory links are links');
  assert.true(grunt.file.isLink(tmpdir.path, 'octocat.png'), 'should work for paths in parts');
  assert.false(grunt.file.isLink('test/fixtures/does/not/exist'), 'nonexistent files are not links');
});
QUnit.test('isDir', function(assert) {
  assert.false(grunt.file.isDir('test/fixtures/octocat.png'), 'files are not directories');
  assert.true(grunt.file.isDir('test/fixtures'), 'directories are directories');
  assert.true(grunt.file.isDir('test', 'fixtures'), 'should work for paths in parts');
  assert.false(grunt.file.isDir(path.join(tmpdir.path, 'octocat.png')), 'file links are not directories');
  assert.true(grunt.file.isDir(path.join(tmpdir.path, 'expand')), 'directory links are directories');
  assert.false(grunt.file.isDir('test/fixtures/does/not/exist'), 'nonexistent files are not directories');
});
QUnit.test('isFile', function(assert) {
  assert.true(grunt.file.isFile('test/fixtures/octocat.png'), 'files are files');
  assert.true(grunt.file.isFile('test', 'fixtures', 'octocat.png'), 'should work for paths in parts');
  assert.false(grunt.file.isFile('test/fixtures'), 'directories are not files');
  assert.true(grunt.file.isFile(path.join(tmpdir.path, 'octocat.png')), 'file links are files');
  assert.false(grunt.file.isFile(path.join(tmpdir.path, 'expand')), 'directory links are not files');
  assert.false(grunt.file.isFile('test/fixtures/does/not/exist'), 'nonexistent files are not files');
});
QUnit.test('isPathAbsolute', function(assert) {
  assert.true(grunt.file.isPathAbsolute(path.resolve('/foo')), 'should return true');
  assert.true(grunt.file.isPathAbsolute(path.resolve('/foo') + path.sep), 'should return true');
  assert.false(grunt.file.isPathAbsolute('foo'), 'should return false');
  assert.true(grunt.file.isPathAbsolute(path.resolve('test/fixtures/a.js')), 'should return true');
  assert.false(grunt.file.isPathAbsolute('test/fixtures/a.js'), 'should return false');
  if (win32) {
    assert.true(grunt.file.isPathAbsolute('C:/Users/'), 'should return true');
  } else {
    assert.true(grunt.file.isPathAbsolute('/'), 'should return true');
  }
});
QUnit.test('arePathsEquivalent', function(assert) {
  assert.true(grunt.file.arePathsEquivalent('/foo'), 'should return true');
  assert.true(grunt.file.arePathsEquivalent('/foo', '/foo/', '/foo/../foo/'), 'should return true');
  assert.true(grunt.file.arePathsEquivalent(process.cwd(), '.', './', 'test/..'), 'should return true');
  assert.false(grunt.file.arePathsEquivalent(process.cwd(), '..'), 'should return false');
  assert.false(grunt.file.arePathsEquivalent('.', '..'), 'should return false');
});
QUnit.test('doesPathContain', function(assert) {
  assert.true(grunt.file.doesPathContain('/foo', '/foo/bar'), 'should return true');
  assert.true(grunt.file.doesPathContain('/foo/', '/foo/bar/baz', '/foo/bar', '/foo/whatever'), 'should return true');
  assert.false(grunt.file.doesPathContain('/foo', '/foo'), 'should return false');
  assert.false(grunt.file.doesPathContain('/foo/xyz', '/foo/xyz/123', '/foo/bar/baz'), 'should return false');
  assert.false(grunt.file.doesPathContain('/foo/xyz', '/foo'), 'should return false');
  assert.true(grunt.file.doesPathContain(process.cwd(), 'test', 'test/fixtures', 'lib'), 'should return true');
});
QUnit.test('isPathCwd', function(assert) {
  assert.true(grunt.file.isPathCwd(process.cwd()), 'cwd is cwd');
  assert.true(grunt.file.isPathCwd('.'), 'cwd is cwd');
  assert.false(grunt.file.isPathCwd('test'), 'subdirectory is not cwd');
  assert.false(grunt.file.isPathCwd(path.resolve('test')), 'subdirectory is not cwd');
  assert.false(grunt.file.isPathCwd('..'), 'parent is not cwd');
  assert.false(grunt.file.isPathCwd(path.resolve('..')), 'parent is not cwd');
  assert.false(grunt.file.isPathCwd('/'), 'root is not cwd (I hope)');
  assert.false(grunt.file.isPathCwd('nonexistent'), 'nonexistent path is not cwd');
});
QUnit.test('isPathInCwd', function(assert) {
  assert.false(grunt.file.isPathInCwd(process.cwd()), 'cwd is not IN cwd');
  assert.false(grunt.file.isPathInCwd('.'), 'cwd is not IN cwd');
  assert.true(grunt.file.isPathInCwd('test'), 'subdirectory is in cwd');
  assert.true(grunt.file.isPathInCwd(path.resolve('test')), 'subdirectory is in cwd');
  assert.false(grunt.file.isPathInCwd('..'), 'parent is not in cwd');
  assert.false(grunt.file.isPathInCwd(path.resolve('..')), 'parent is not in cwd');
  assert.false(grunt.file.isPathInCwd('/'), 'root is not in cwd (I hope)');
  assert.false(grunt.file.isPathInCwd('nonexistent'), 'nonexistent path is not in cwd');
});
QUnit.test('symbolicLinkDestError', function(assert) {
  var tmpfile = new Tempdir();
  fs.symlinkSync(path.resolve('test/fixtures/octocat.png'), path.join(tmpfile.path, 'octocat.png'), 'file');
  grunt.file.copy(path.resolve('test/fixtures/octocat.png'), path.join(tmpfile.path, 'octocat.png'));
  assert.true(fs.lstatSync(path.join(tmpfile.path, 'octocat.png')).isSymbolicLink());
});

QUnit.module('file [cwdUnderSymlink]', {
  beforeEach: function() {
    this.cwd = process.cwd();
    process.chdir(path.join(tmpdir.path, 'expand'));
  },
  afterEach: function() {
    process.chdir(this.cwd);
  }
});
QUnit.test('isPathCwd', function(assert) {
  assert.true(grunt.file.isPathCwd(process.cwd()), 'cwd is cwd');
  assert.true(grunt.file.isPathCwd('.'), 'cwd is cwd');
});
QUnit.test('isPathInCwd', function(assert) {
  assert.true(grunt.file.isPathInCwd('deep'), 'subdirectory is in cwd');
  assert.true(grunt.file.isPathInCwd(path.resolve('deep')), 'subdirectory is in cwd');
});
QUnit.test('symbolicLinkCopy', function(assert) {
  var srcfile = new Tempdir();
  fs.symlinkSync(path.resolve('test/fixtures/octocat.png'), path.join(srcfile.path, 'octocat.png'), 'file');
  // test symlink copy for files
  var destdir = new Tempdir();
  grunt.file.copy(path.join(srcfile.path, 'octocat.png'), path.join(destdir.path, 'octocat.png'));
  assert.true(fs.lstatSync(path.join(srcfile.path, 'octocat.png')).isSymbolicLink());
  assert.true(fs.lstatSync(path.join(destdir.path, 'octocat.png')).isSymbolicLink());

  // test symlink copy for directories
  var srcdir = new Tempdir();
  var destdir = new Tempdir();
  var fixtures = path.resolve('test/fixtures');
  var symlinkSource = path.join(srcdir.path, path.basename(fixtures));
  var destSource = path.join(destdir.path, path.basename(fixtures));
  fs.symlinkSync(fixtures, symlinkSource, 'dir');

  grunt.file.copy(symlinkSource, destSource);
  assert.true(fs.lstatSync(symlinkSource).isSymbolicLink());
  assert.true(fs.lstatSync(path.join(destdir.path, path.basename(fixtures))).isSymbolicLink());
});

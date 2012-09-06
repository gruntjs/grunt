'use strict';

var grunt = require('../../lib/grunt');

var fs = require('fs');
var path = require('path');

var Tempfile = require('temporary/lib/file');
var Tempdir = require('temporary/lib/dir');

var tmpdir = new Tempdir();
fs.symlinkSync(path.resolve('test/fixtures/octocat.png'), path.join(tmpdir.path, 'octocat.png'), 'file');
fs.symlinkSync(path.resolve('test/fixtures/expand'), path.join(tmpdir.path, 'expand'), 'dir');

exports['file.match'] = {
  'empty set': function(test) {
    test.expect(12);
    // Should return empty set if a required argument is missing or an empty set.
    test.deepEqual(grunt.file.match(null, null), [], 'should return empty set.');
    test.deepEqual(grunt.file.match({}, null, null), [], 'should return empty set.');
    test.deepEqual(grunt.file.match(null, 'foo.js'), [], 'should return empty set.');
    test.deepEqual(grunt.file.match('*.js', null), [], 'should return empty set.');
    test.deepEqual(grunt.file.match({}, null, 'foo.js'), [], 'should return empty set.');
    test.deepEqual(grunt.file.match({}, '*.js', null), [], 'should return empty set.');
    test.deepEqual(grunt.file.match({}, [], 'foo.js'), [], 'should return empty set.');
    test.deepEqual(grunt.file.match({}, '*.js', []), [], 'should return empty set.');
    test.deepEqual(grunt.file.match(null, ['foo.js']), [], 'should return empty set.');
    test.deepEqual(grunt.file.match(['*.js'], null), [], 'should return empty set.');
    test.deepEqual(grunt.file.match({}, null, ['foo.js']), [], 'should return empty set.');
    test.deepEqual(grunt.file.match({}, ['*.js'], null), [], 'should return empty set.');
    test.done();
  },
  'basic matching': function(test) {
    test.expect(6);
    test.deepEqual(grunt.file.match('*.js', 'foo.js'), ['foo.js'], 'should match correctly.');
    test.deepEqual(grunt.file.match('*.js', ['foo.js']), ['foo.js'], 'should match correctly.');
    test.deepEqual(grunt.file.match('*.js', ['foo.js', 'bar.css']), ['foo.js'], 'should match correctly.');
    test.deepEqual(grunt.file.match(['*.js', '*.css'], 'foo.js'), ['foo.js'], 'should match correctly.');
    test.deepEqual(grunt.file.match(['*.js', '*.css'], ['foo.js']), ['foo.js'], 'should match correctly.');
    test.deepEqual(grunt.file.match(['*.js', '*.css'], ['foo.js', 'bar.css']), ['foo.js', 'bar.css'], 'should match correctly.');
    test.done();
  },
  'no matches': function(test) {
    test.expect(2);
    test.deepEqual(grunt.file.match('*.js', 'foo.css'), [], 'should fail to match.');
    test.deepEqual(grunt.file.match('*.js', ['foo.css', 'bar.css']), [], 'should fail to match.');
    test.done();
  },
  'unique': function(test) {
    test.expect(2);
    test.deepEqual(grunt.file.match('*.js', ['foo.js', 'foo.js']), ['foo.js'], 'should return a uniqued set.');
    test.deepEqual(grunt.file.match(['*.js', '*.*'], ['foo.js', 'foo.js']), ['foo.js'], 'should return a uniqued set.');
    test.done();
  },
  'flatten': function(test) {
    test.expect(1);
    test.deepEqual(grunt.file.match([['*.js', '*.css'], ['*.*', '*.js']], ['foo.js', 'bar.css']), ['foo.js', 'bar.css'], 'should process nested pattern arrays correctly.');
    test.done();
  },
  'exclusion': function(test) {
    test.expect(5);
    test.deepEqual(grunt.file.match(['!*.js'], ['foo.js', 'bar.js']), [], 'solitary exclusion should match nothing');
    test.deepEqual(grunt.file.match(['*.js', '!*.js'], ['foo.js', 'bar.js']), [], 'exclusion should cancel match');
    test.deepEqual(grunt.file.match(['*.js', '!f*.js'], ['foo.js', 'bar.js', 'baz.js']), ['bar.js', 'baz.js'], 'partial exclusion should partially cancel match');
    test.deepEqual(grunt.file.match(['*.js', '!*.js', 'b*.js'], ['foo.js', 'bar.js', 'baz.js']), ['bar.js', 'baz.js'], 'inclusion / exclusion order matters');
    test.deepEqual(grunt.file.match(['*.js', '!f*.js', '*.js'], ['foo.js', 'bar.js', 'baz.js']), ['bar.js', 'baz.js', 'foo.js'], 'inclusion / exclusion order matters');
    test.done();
  },
  'options.matchBase': function(test) {
    test.expect(2);
    test.deepEqual(grunt.file.match({matchBase: true}, '*.js', ['foo.js', 'bar', 'baz/xyz.js']), ['foo.js', 'baz/xyz.js'], 'should matchBase (minimatch) when specified.');
    test.deepEqual(grunt.file.match('*.js', ['foo.js', 'bar', 'baz/xyz.js']), ['foo.js'], 'should not matchBase (minimatch) by default.');
    test.done();
  }
};

exports['file.isMatch'] = {
  'basic matching': function(test) {
    test.expect(6);
    test.ok(grunt.file.isMatch('*.js', 'foo.js'), 'should match correctly.');
    test.ok(grunt.file.isMatch('*.js', ['foo.js']), 'should match correctly.');
    test.ok(grunt.file.isMatch('*.js', ['foo.js', 'bar.css']), 'should match correctly.');
    test.ok(grunt.file.isMatch(['*.js', '*.css'], 'foo.js'), 'should match correctly.');
    test.ok(grunt.file.isMatch(['*.js', '*.css'], ['foo.js']), 'should match correctly.');
    test.ok(grunt.file.isMatch(['*.js', '*.css'], ['foo.js', 'bar.css']), 'should match correctly.');
    test.done();
  },
  'no matches': function(test) {
    test.expect(6);
    test.equal(grunt.file.isMatch('*.js', 'foo.css'), false, 'should fail to match.');
    test.equal(grunt.file.isMatch('*.js', ['foo.css', 'bar.css']), false, 'should fail to match.');
    test.equal(grunt.file.isMatch(null, 'foo.css'), false, 'should fail to match.');
    test.equal(grunt.file.isMatch('*.js', null), false, 'should fail to match.');
    test.equal(grunt.file.isMatch([], 'foo.css'), false, 'should fail to match.');
    test.equal(grunt.file.isMatch('*.js', []), false, 'should fail to match.');
    test.done();
  },
  'options.matchBase': function(test) {
    test.expect(2);
    test.ok(grunt.file.isMatch({matchBase: true}, '*.js', ['baz/xyz.js']), 'should matchBase (minimatch) when specified.');
    test.equal(grunt.file.isMatch('*.js', ['baz/xyz.js']), false, 'should not matchBase (minimatch) by default.');
    test.done();
  }
};

exports['file.expand*'] = {
  setUp: function(done) {
    this.cwd = process.cwd();
    process.chdir('test/fixtures/expand');
    done();
  },
  tearDown: function(done) {
    process.chdir(this.cwd);
    done();
  },
  'basic matching': function(test) {
    test.expect(7);
    test.deepEqual(grunt.file.expand('**/*.js'), ['js/bar.js', 'js/foo.js'], 'should match.');
    test.deepEqual(grunt.file.expand('**/*.js', '**/*.css'), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match.');
    test.deepEqual(grunt.file.expand(['**/*.js', '**/*.css']), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match.');
    test.deepEqual(grunt.file.expand('**d*/**'), [
      'deep/',
      'deep/deep.txt',
      'deep/deeper/',
      'deep/deeper/deeper.txt',
      'deep/deeper/deepest/',
      'deep/deeper/deepest/deepest.txt'], 'should match files and directories.');
    test.deepEqual(grunt.file.expandFiles('**d*/**'), [
      'deep/deep.txt',
      'deep/deeper/deeper.txt',
      'deep/deeper/deepest/deepest.txt'], 'should match files only.');
    test.deepEqual(grunt.file.expand('**d*/**/'), [
      'deep/',
      'deep/deeper/',
      'deep/deeper/deepest/'], 'should match directories only.');
    test.deepEqual(grunt.file.expandDirs('**d*/**'), [
      'deep/',
      'deep/deeper/',
      'deep/deeper/deepest/'], 'should match directories only.');
    test.done();
  },
  'no matches': function(test) {
    test.expect(3);
    test.deepEqual(grunt.file.expand('*.xyz'), [], 'should fail to match.');
    test.deepEqual(grunt.file.expandDirs('**/*.js'), [], 'should fail to match.');
    test.deepEqual(grunt.file.expandFiles('js', 'css'), [], 'should fail to match.');
    test.done();
  },
  'unique': function(test) {
    test.expect(2);
    test.deepEqual(grunt.file.expand('**/*.js', 'js/*.js'), ['js/bar.js', 'js/foo.js'], 'file list should be uniqed.');
    test.deepEqual(grunt.file.expand('**/*.js', '**/*.css', 'js/*.js'), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'file list should be uniqed.');
    test.done();
  },
  'file order': function(test) {
    test.expect(4);
    var actual = grunt.file.expand('**/*.{js,css}');
    var expected = ['css/baz.css', 'css/qux.css', 'js/bar.js', 'js/foo.js'];
    test.deepEqual(actual, expected, 'should select 4 files in this order, by default.');

    actual = grunt.file.expand('js/foo.js', 'js/bar.js', '**/*.{js,css}');
    expected = ['js/foo.js', 'js/bar.js', 'css/baz.css', 'css/qux.css'];
    test.deepEqual(actual, expected, 'specifically-specified-up-front file order should be maintained.');

    actual = grunt.file.expand('js/bar.js', 'js/foo.js', '**/*.{js,css}');
    expected = ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'];
    test.deepEqual(actual, expected, 'specifically-specified-up-front file order should be maintained.');

    actual = grunt.file.expand('js/foo.js', '**/*.{js,css}', '!js/bar.js', 'js/bar.js');
    expected = ['js/foo.js', 'css/baz.css', 'css/qux.css', 'js/bar.js'];
    test.deepEqual(actual, expected, 'if a file is excluded and then re-added, it should be added at the end.');
    test.done();
  },
  'flatten': function(test) {
    test.expect(1);
    test.deepEqual(grunt.file.expand([['**/*.js'], ['**/*.css', 'js/*.js']]), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match.');
    test.done();
  },
  'exclusion': function(test) {
    test.expect(8);
    test.deepEqual(grunt.file.expand(['!js/*.js']), [], 'solitary exclusion should match nothing');
    test.deepEqual(grunt.file.expand(['js/bar.js','!js/bar.js']), [], 'exclusion should cancel match');
    test.deepEqual(grunt.file.expand(['**/*.js', '!js/foo.js']), ['js/bar.js'], 'should omit single file from matched set');
    test.deepEqual(grunt.file.expand(['!js/foo.js', '**/*.js']), ['js/bar.js', 'js/foo.js'], 'inclusion / exclusion order matters');
    test.deepEqual(grunt.file.expand(['**/*.js', '**/*.css', '!js/bar.js', '!css/baz.css']), ['js/foo.js','css/qux.css'], 'multiple exclusions should be removed from the set');
    test.deepEqual(grunt.file.expand(['**/*.js', '**/*.css', '!**/*.css']), ['js/bar.js', 'js/foo.js'], 'excluded wildcards should be removed from the matched set');
    test.deepEqual(grunt.file.expand(['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css', '!**/b*.*']), ['js/foo.js', 'css/qux.css'], 'different pattern for exclusion should still work');
    test.deepEqual(grunt.file.expand(['js/bar.js', '!**/b*.*', 'js/foo.js', 'css/baz.css', 'css/qux.css']), ['js/foo.js', 'css/baz.css', 'css/qux.css'], 'inclusion / exclusion order matters');
    test.done();
  },
  'options.matchBase': function(test) {
    test.expect(4);
    var opts = {matchBase: true};
    test.deepEqual(grunt.file.expand('*.js'), [], 'should not matchBase (minimatch) by default.');
    test.deepEqual(grunt.file.expand(opts, '*.js'), ['js/bar.js', 'js/foo.js'], 'options should be passed through to minimatch.');
    test.deepEqual(grunt.file.expand(opts, '*.js', '*.css'), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match.');
    test.deepEqual(grunt.file.expand(opts, ['*.js', '*.css']), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match.');
    test.done();
  },
  'options.cwd': function(test) {
    test.expect(4);
    var opts = {cwd: path.resolve(process.cwd(), '..')};
    test.deepEqual(grunt.file.expand(opts, ['expand/js', 'expand/js/*']), ['expand/js/', 'expand/js/bar.js', 'expand/js/foo.js'], 'should match.');
    test.deepEqual(grunt.file.expandFiles(opts, ['expand/js', 'expand/js/*']), ['expand/js/bar.js', 'expand/js/foo.js'], 'should match.');
    test.deepEqual(grunt.file.expandDirs(opts, ['expand/js', 'expand/js/*']), ['expand/js/'], 'should match.');
    test.deepEqual(grunt.file.expandFiles(opts, ['expand/js', 'expand/js/*', '!**/b*.js']), ['expand/js/foo.js'], 'should negate properly.');
    test.done();
  }
};

// test helper
//
// compare - to effectively compare Buffers, we would need something like
// bnoordhuis/buffertools, but I'd rather not add a new dependency for the sake
// of testing.
//
// So we're relying on comparisons between the `hex` of buffers to do that,
// seems to be reliant enough to cover our test needs with file copy.
function compare(actual, expected, encoding) {
  encoding = encoding || 'hex';
  return fs.readFileSync(actual, encoding) === fs.readFileSync(expected, encoding);
}

exports['file'] = {
  'isPathAbsolute': function(test) {
    test.expect(2);
    test.ok(grunt.file.isPathAbsolute(path.resolve('test/fixtures/a.js')), 'should return true');
    test.equal(grunt.file.isPathAbsolute('test/fixtures/a.js'), false, 'should return false');
    test.done();
  },
  'read': function(test) {
    test.expect(4);
    test.strictEqual(grunt.file.read('test/fixtures/a.js'), fs.readFileSync('test/fixtures/a.js', 'utf8'));
    test.strictEqual(grunt.file.read('test/fixtures/octocat.png'), fs.readFileSync('test/fixtures/octocat.png', 'utf8'));
    test.strictEqual(grunt.file.read('test/fixtures/no_BOM.txt'), 'foo', 'file should be read as-expected.');
    test.strictEqual(grunt.file.read('test/fixtures/BOM.txt'), 'foo', 'BOM should be stripped from string.');
    test.done();
  },
  'readYAML': function(test) {
    test.expect(2);
    var obj = grunt.file.readYAML('test/fixtures/test.yaml');
    test.equal(obj.foo, 'bar', 'YAML properties should be available as-defined.');
    test.deepEqual(obj.baz, [1, 2, 3], 'YAML properties should be available as-defined.');
    test.done();
  },
  'write': function(test) {
    test.expect(4);
    var tmpfile = new Tempfile();
    var content = 'var a = "foobar";';
    grunt.file.write(tmpfile.path, content);
    test.strictEqual(fs.readFileSync(tmpfile.path, 'utf8'), content);
    test.strictEqual(grunt.file.read(tmpfile.path), content);
    tmpfile.unlinkSync();

    tmpfile = new Tempfile();
    var octocat = fs.readFileSync('test/fixtures/octocat.png');
    grunt.file.write(tmpfile.path, octocat);
    test.strictEqual(fs.readFileSync(tmpfile.path, 'utf8'), fs.readFileSync('test/fixtures/octocat.png', 'utf8'));
    test.ok(compare(tmpfile.path, 'test/fixtures/octocat.png'), 'both buffers should match');
    tmpfile.unlinkSync();

    test.done();
  },
  'copy': function(test) {
    test.expect(6);
    var tmpfile = new Tempfile();
    grunt.file.copy('test/fixtures/a.js', tmpfile.path);
    test.strictEqual(fs.readFileSync(tmpfile.path, 'utf8'), fs.readFileSync('test/fixtures/a.js', 'utf8'));
    tmpfile.unlinkSync();

    var tmpltest = '// should src be a string and template process be all good.';
    tmpfile = new Tempfile();
    grunt.file.copy('test/fixtures/a.js', tmpfile.path, {process: function(src) {
      test.equal(Buffer.isBuffer(src), false);
      test.equal(typeof src, 'string');
      return grunt.template.process(src + '<%= tmpltest %>', {data: {tmpltest: tmpltest}});
    }});
    test.strictEqual(fs.readFileSync(tmpfile.path, 'utf8'), grunt.util.normalizelf(fs.readFileSync('test/fixtures/a.js', 'utf8')) + tmpltest);
    tmpfile.unlinkSync();

    tmpfile = new Tempfile();
    grunt.file.copy('test/fixtures/octocat.png', tmpfile.path);
    test.strictEqual(fs.readFileSync(tmpfile.path, 'utf8'), fs.readFileSync('test/fixtures/octocat.png', 'utf8'));
    test.ok(compare(tmpfile.path, 'test/fixtures/octocat.png'), 'both buffers should match');
    tmpfile.unlinkSync();

    test.done();
  },
  'delete': function(test) {
    test.expect(2);
    var oldBase = process.cwd();
    var cwd = path.resolve(tmpdir.path, 'delete', 'folder');
    grunt.file.mkdir(cwd);
    grunt.file.setBase(tmpdir.path);

    grunt.file.write(path.join(cwd, 'test.js'), 'var test;');
    test.ok(grunt.file.delete(cwd), 'should return true after deleting file.');
    test.equal(grunt.file.exists(cwd), false, 'file should have been deleted.');
    grunt.file.setBase(oldBase);
    test.done();
  },
  'delete outside working directory': function(test) {
    test.expect(3);
    var oldBase = process.cwd();
    var oldWarn = grunt.fail.warn;
    grunt.fail.warn = function() {};

    var cwd = path.resolve(tmpdir.path, 'delete', 'folder');
    var outsidecwd = path.resolve(tmpdir.path, 'delete', 'outsidecwd');
    grunt.file.mkdir(cwd);
    grunt.file.mkdir(outsidecwd);
    grunt.file.setBase(cwd);

    grunt.file.write(path.join(outsidecwd, 'test.js'), 'var test;');
    test.equal(grunt.file.delete(path.join(outsidecwd, 'test.js')), false, 'should not delete anything outside the cwd.');

    test.ok(grunt.file.delete(path.join(outsidecwd), {force:true}), 'should delete outside cwd using the --force.');
    test.equal(grunt.file.exists(outsidecwd), false, 'file outside cwd should have been deleted using the --force.');

    grunt.file.setBase(oldBase);
    grunt.fail.warn = oldWarn;
    test.done();
  },
  'dont delete current working directory': function(test) {
    test.expect(2);
    var oldBase = process.cwd();
    var oldWarn = grunt.fail.warn;
    grunt.fail.warn = function() {};

    var cwd = path.resolve(tmpdir.path, 'dontdelete', 'folder');
    grunt.file.mkdir(cwd);
    grunt.file.setBase(cwd);

    test.equal(grunt.file.delete(cwd), false, 'should not delete the cwd.');
    test.ok(grunt.file.exists(cwd), 'the cwd should exist.');

    grunt.file.setBase(oldBase);
    grunt.fail.warn = oldWarn;
    test.done();
  },
  'dont actually delete with no-write option on': function(test) {
    test.expect(2);
    var oldNoWrite = grunt.option('write');
    grunt.option('write', false);

    var oldBase = process.cwd();
    var cwd = path.resolve(tmpdir.path, 'dontdelete', 'folder');
    grunt.file.mkdir(cwd);
    grunt.file.setBase(tmpdir.path);

    grunt.file.write(path.join(cwd, 'test.js'), 'var test;');
    test.ok(grunt.file.delete(cwd), 'should return true after not actually deleting file.');
    test.equal(grunt.file.exists(cwd), true, 'file should NOT have been deleted.');
    grunt.file.setBase(oldBase);

    grunt.option('write', oldNoWrite);
    test.done();
  },
  'exists': function(test) {
    test.expect(6);
    test.ok(grunt.file.exists('test/fixtures/octocat.png'), 'files exist.');
    test.ok(grunt.file.exists('test', 'fixtures', 'octocat.png'), 'should work for paths in parts.');
    test.ok(grunt.file.exists('test/fixtures'), 'directories exist.');
    test.ok(grunt.file.exists(path.join(tmpdir.path, 'octocat.png')), 'file links exist.');
    test.ok(grunt.file.exists(path.join(tmpdir.path, 'expand')), 'directory links exist.');
    test.equal(grunt.file.exists('test/fixtures/does/not/exist'), false, 'nonexistent files do not exist.');
    test.done();
  },
  'isLink': function(test) {
    test.expect(6);
    test.equals(grunt.file.isLink('test/fixtures/octocat.png'), false, 'files are not links.');
    test.equals(grunt.file.isLink('test/fixtures'), false, 'directories are not links.');
    test.ok(grunt.file.isLink(path.join(tmpdir.path, 'octocat.png')), 'file links are links.');
    test.ok(grunt.file.isLink(path.join(tmpdir.path, 'expand')), 'directory links are links.');
    test.ok(grunt.file.isLink(tmpdir.path, 'octocat.png'), 'should work for paths in parts.');
    test.equals(grunt.file.isLink('test/fixtures/does/not/exist'), false, 'nonexistent files are not links.');
    test.done();
  },
  'isDir': function(test) {
    test.expect(6);
    test.equals(grunt.file.isDir('test/fixtures/octocat.png'), false, 'files are not directories.');
    test.ok(grunt.file.isDir('test/fixtures'), 'directories are directories.');
    test.ok(grunt.file.isDir('test', 'fixtures'), 'should work for paths in parts.');
    test.equals(grunt.file.isDir(path.join(tmpdir.path, 'octocat.png')), false, 'file links are not directories.');
    test.ok(grunt.file.isDir(path.join(tmpdir.path, 'expand')), 'directory links are directories.');
    test.equals(grunt.file.isDir('test/fixtures/does/not/exist'), false, 'nonexistent files are not directories.');
    test.done();
  },
  'isFile': function(test) {
    test.expect(6);
    test.ok(grunt.file.isFile('test/fixtures/octocat.png'), 'files are files.');
    test.ok(grunt.file.isFile('test', 'fixtures', 'octocat.png'), 'should work for paths in parts.');
    test.equals(grunt.file.isFile('test/fixtures'), false, 'directories are not files.');
    test.ok(grunt.file.isFile(path.join(tmpdir.path, 'octocat.png')), 'file links are files.');
    test.equals(grunt.file.isFile(path.join(tmpdir.path, 'expand')), false, 'directory links are not files.');
    test.equals(grunt.file.isFile('test/fixtures/does/not/exist'), false, 'nonexistent files are not files.');
    test.done();
  },
  'mkdir': function(test) {
    test.expect(5);
    // In Nodejs 0.8.0, existsSync moved from path -> fs.
    var existsSync = fs.existsSync || path.existsSync;

    test.doesNotThrow(function() {
      grunt.file.mkdir(tmpdir.path);
    }, 'Should not explode if the directory already exists.');
    test.ok(existsSync(tmpdir.path), 'path should still exist.');

    test.doesNotThrow(function() {
      grunt.file.mkdir(path.join(tmpdir.path, 'aa/bb/cc'));
    }, 'Should also not explode, otherwise.');
    test.ok(path.join(tmpdir.path, 'aa/bb/cc'), 'path should have been created.');

    fs.writeFileSync(path.join(tmpdir.path, 'aa/bb/xx'), 'test');
    test.throws(function() {
      grunt.file.mkdir(path.join(tmpdir.path, 'aa/bb/xx/yy'));
    }, 'Should throw if a path cannot be created (ENOTDIR).');

    test.done();
  },
  'recurse': function(test) {
    test.expect(1);
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

    test.deepEqual(actual, expected, 'paths and arguments should match.');
    test.done();
  }
};

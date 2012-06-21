'use strict';

var grunt = require('../../lib/grunt');

var fs = require('fs');
var path = require('path');

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
  'no directives': function(test) {
    test.expect(2);
    grunt.registerHelper('omg', function() {});
    test.deepEqual(grunt.file.match(['*.js', '<omg>'], 'foo.js'), ['foo.js'], 'should filter out directives.');
    test.deepEqual(grunt.file.match(['<omg:a:b>', '*.js'], 'foo.js'), ['foo.js'], 'should filter out directives.');
    test.done();
  },
  'exclude': function(test) {
    test.expect(3);
    test.deepEqual(grunt.file.match(['*.js', '!*.js'], ['foo.js', 'bar.js']), [], 'negation should cancel match');
    test.deepEqual(grunt.file.match(['*.js', '!f*.js'], ['foo.js', 'bar.js', 'baz.js']), ['bar.js', 'baz.js'], 'partial negation should partially cancel match');
    test.deepEqual(grunt.file.match(['!b*.js', '*.js'], ['foo.js', 'bar.js', 'baz.js']), ['foo.js'], 'partial negation should partially cancel match');
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
    test.deepEqual(grunt.file.expand('**/*.js', 'js/*.js'), ['js/bar.js', 'js/foo.js'], 'should match.');
    test.deepEqual(grunt.file.expand('**/*.js', '**/*.css', 'js/*.js'), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match.');
    test.done();
  },
  'flatten': function(test) {
    test.expect(1);
    test.deepEqual(grunt.file.expand([['**/*.js'], ['**/*.css', 'js/*.js']]), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match.');
    test.done();
  },
  'directives': function(test) {
    test.expect(3);
    grunt.registerHelper('omg', function() {});
    test.deepEqual(grunt.file.expand('<omg>'), ['<omg>'], 'should retain valid directives.');
    test.deepEqual(grunt.file.expand(['**/*.js', '<omg>']), ['js/bar.js', 'js/foo.js', '<omg>'], 'should retain valid directives.');
    test.deepEqual(grunt.file.expand(['<omg:a:b>', '**/*.js']), ['<omg:a:b>', 'js/bar.js', 'js/foo.js'], 'should retain valid directives.');
    test.done();
  },
  'exclude': function(test) {
    test.expect(6);
    test.deepEqual(grunt.file.expand(['js/bar.js','!js/bar.js']), [], 'negation should cancel match');
    test.deepEqual(grunt.file.expand(['**/*.js', '!js/foo.js']), ['js/bar.js'], 'should omit single file from matched set');
    test.deepEqual(grunt.file.expand(['!js/foo.js', '**/*.js']), ['js/bar.js'], 'order of negation should not matter');
    test.deepEqual(grunt.file.expand(['**/*.js', '**/*.css', '!js/bar.js', '!css/baz.css']), ['js/foo.js','css/qux.css'], 'multiple negations should be removed from the set');
    test.deepEqual(grunt.file.expand(['**/*.js', '**/*.css', '!**/*.css']), ['js/bar.js', 'js/foo.js'], 'negated wildcards should be removed from the matched set');
    test.deepEqual(grunt.file.expand(['!**/b*.*', 'js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css']), ['js/foo.js', 'css/qux.css'], 'different pattern for negation should still work');
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
    test.expect(2);
    test.strictEqual(grunt.file.read('test/fixtures/a.js'), fs.readFileSync('test/fixtures/a.js', 'utf8'));
    test.strictEqual(grunt.file.read('test/fixtures/octocat.png'), fs.readFileSync('test/fixtures/octocat.png', 'utf8'));
    test.done();
  },
  'write': function(test) {
    test.expect(4);
    var content = 'var a = "foobar";';
    grunt.file.write('test/fixtures/test_write.js', content);
    test.strictEqual(fs.readFileSync('test/fixtures/test_write.js', 'utf8'), content);
    test.strictEqual(grunt.file.read('test/fixtures/test_write.js'), content);

    var octocat = fs.readFileSync('test/fixtures/octocat.png');
    grunt.file.write('test/fixtures/test_write.png', octocat);
    test.strictEqual(fs.readFileSync('test/fixtures/test_write.png', 'utf8'), fs.readFileSync('test/fixtures/octocat.png', 'utf8'));
    test.ok(compare('test/fixtures/test_write.png', 'test/fixtures/octocat.png'), 'both buffers should match');

    ['test/fixtures/test_write.js', 'test/fixtures/test_write.png'].forEach(fs.unlinkSync);
    test.done();
  },
  'copy': function(test) {
    test.expect(6);
    grunt.file.copy('test/fixtures/a.js', 'test/fixtures/test_copy.js');
    test.strictEqual(fs.readFileSync('test/fixtures/test_copy.js', 'utf8'), fs.readFileSync('test/fixtures/a.js', 'utf8'));

    var tmpltest = '// should src be a string and template process be all good.';
    grunt.file.copy('test/fixtures/a.js', 'test/fixtures/test_copy.js', {process: function(src) {
      test.equal(Buffer.isBuffer(src), false);
      test.equal(typeof src, 'string');
      return grunt.template.process(src + '<%= tmpltest %>', {tmpltest: tmpltest});
    }});
    test.strictEqual(fs.readFileSync('test/fixtures/test_copy.js', 'utf8'), grunt.util.normalizelf(fs.readFileSync('test/fixtures/a.js', 'utf8')) + tmpltest);

    grunt.file.copy('test/fixtures/octocat.png', 'test/fixtures/test_copy.png');
    test.strictEqual(fs.readFileSync('test/fixtures/test_copy.png', 'utf8'), fs.readFileSync('test/fixtures/octocat.png', 'utf8'));
    test.ok(compare('test/fixtures/test_copy.png', 'test/fixtures/octocat.png'), 'both buffers should match');

    ['test/fixtures/test_copy.js', 'test/fixtures/test_copy.png'].forEach(fs.unlinkSync);
    test.done();
  },
  'exists': function(test) {
    test.expect(5);
    test.ok(grunt.file.exists('test/fixtures/octocat.png'), 'should return true');
    test.ok(grunt.file.exists('test', 'fixtures', 'octocat.png'), 'should return true');
    test.ok(grunt.file.exists('test/fixtures/octocat-link.png'), 'should return true');
    test.ok(grunt.file.exists('test/fixtures'), 'should return true');
    test.equal(grunt.file.exists('test/fixtures/does/not/exist'), false, 'should return false');
    test.done();
  },
  'isLink': function(test) {
    test.expect(4);
    test.equals(grunt.file.isLink('test/fixtures/octocat.png'), false, 'should return false');
    test.ok(grunt.file.isLink('test/fixtures/octocat-link.png'), 'should return true');
    test.equals(grunt.file.isLink('test/fixtures'), false, 'should return false');
    test.equals(grunt.file.isLink('test/fixtures/does/not/exist'), false, 'should return false');
    test.done();
  },
  'isDir': function(test) {
    test.expect(4);
    test.equals(grunt.file.isDir('test/fixtures/octocat.png'), false, 'should return false');
    test.equals(grunt.file.isDir('test/fixtures/octocat-link.png'), false, 'should return false');
    test.ok(grunt.file.isDir('test/fixtures'), 'should return true');
    test.equals(grunt.file.isDir('test/fixtures/does/not/exist'), false, 'should return false');
    test.done();
  },
  'isFile': function(test) {
    test.expect(4);
    test.ok(grunt.file.isFile('test/fixtures/octocat.png'), 'should return true');
    test.ok(grunt.file.isFile('test/fixtures/octocat-link.png'), 'should return true');
    test.equals(grunt.file.isFile('test/fixtures'), false, 'should return false');
    test.equals(grunt.file.isFile('test/fixtures/does/not/exist'), false, 'should return false');
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

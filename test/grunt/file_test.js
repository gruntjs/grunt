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
  'options': function(test) {
    test.expect(4);
    test.deepEqual(grunt.file.expand('*.js'), [], 'should not matchBase (minimatch) by default.');
    test.deepEqual(grunt.file.expand({matchBase: true}, '*.js'), ['js/bar.js', 'js/foo.js'], 'options should be passed through to minimatch.');
    test.deepEqual(grunt.file.expand({matchBase: true}, '*.js', '*.css'), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match.');
    test.deepEqual(grunt.file.expand({matchBase: true}, ['*.js', '*.css']), ['js/bar.js', 'js/foo.js', 'css/baz.css', 'css/qux.css'], 'should match.');
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
    test.strictEqual(fs.readFileSync('test/fixtures/test_copy.js', 'utf8'), grunt.utils.normalizelf(fs.readFileSync('test/fixtures/a.js', 'utf8')) + tmpltest);

    grunt.file.copy('test/fixtures/octocat.png', 'test/fixtures/test_copy.png');
    test.strictEqual(fs.readFileSync('test/fixtures/test_copy.png', 'utf8'), fs.readFileSync('test/fixtures/octocat.png', 'utf8'));
    test.ok(compare('test/fixtures/test_copy.png', 'test/fixtures/octocat.png'), 'both buffers should match');

    ['test/fixtures/test_copy.js', 'test/fixtures/test_copy.png'].forEach(fs.unlinkSync);
    test.done();
  }
};

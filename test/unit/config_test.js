'use strict';

var grunt = require('../../lib/grunt');

QUnit.module('config', {
  beforeEach: function() {
    this.origData = grunt.config.data;
    grunt.config.init({
      meta: grunt.file.readJSON('test/fixtures/test.json'),
      foo: '<%= meta.foo %>',
      foo2: '<%= foo %>',
      obj: {
        foo: '<%= meta.foo %>',
        foo2: '<%= obj.foo %>',
        Arr: ['foo', '<%= obj.foo2 %>'],
        arr2: ['<%= arr %>', '<%= obj.Arr %>']
      },
      bar: 'bar',
      arr: ['foo', '<%= obj.foo2 %>'],
      arr2: ['<%= arr %>', '<%= obj.Arr %>'],
      buffer: Buffer.from('test')
    });
  },
  afterEach: function() {
    grunt.config.data = this.origData;
    grunt.log.muted = false;
  }
});

QUnit.test('config.escape', function(assert) {
  assert.equal(grunt.config.escape('foo'), 'foo', 'Do nothing if no dots');
  assert.equal(grunt.config.escape('foo.bar.baz'), 'foo\\.bar\\.baz', 'Escape all dots');
});

QUnit.test('config.getPropString', function(assert) {
  assert.equal(grunt.config.getPropString('foo'), 'foo', 'do nothing if already a string');
  assert.equal(grunt.config.getPropString('foo.bar.baz'), 'foo.bar.baz', 'do nothing if already a string');
  assert.equal(grunt.config.getPropString(['foo', 'bar']), 'foo.bar', 'join parts into a dot-delimited string');
  assert.equal(
    grunt.config.getPropString(['foo.bar', 'baz.qux.zip']),
    'foo\\.bar.baz\\.qux\\.zip',
    'Join parts into a dot-delimited string, escaping dots in parts.'
  );
});

QUnit.test('config.getRaw', function(assert) {
  assert.equal(grunt.config.getRaw('foo'), '<%= meta.foo %>', 'ignore templates');
  assert.equal(grunt.config.getRaw('obj.foo2'), '<%= obj.foo %>', 'ignore templates');
  assert.equal(grunt.config.getRaw(['obj', 'foo2']), '<%= obj.foo %>', 'ignore templates');
  assert.deepEqual(grunt.config.getRaw('arr'), ['foo', '<%= obj.foo2 %>'], 'ignore templates');
});

QUnit.test('config.process', function(assert) {
  assert.equal(grunt.config.process('<%= meta.foo %>'), 'bar', 'templates');
  assert.equal(grunt.config.process('<%= foo %>'), 'bar', 'templates recursively');
  assert.equal(grunt.config.process('<%= obj.foo %>'), 'bar', 'deeply nested templates recursively');
  assert.deepEqual(grunt.config.process(['foo', '<%= obj.foo2 %>']), ['foo', 'bar'], 'templates in arrays');
  assert.deepEqual(
    grunt.config.process(['<%= arr %>', '<%= obj.Arr %>']),
    [['foo', 'bar'], ['foo', 'bar']],
    'expand <%= arr %> and <%= obj.Arr %> values as objects if possible'
  );

  var buf = grunt.config.process('<%= buffer %>');
  assert.true(Buffer.isBuffer(buf), 'retrieve Buffer instances as Buffer');
  assert.strictEqual(buf.toString('utf8'), 'test', 'return buffers as-is');
});

QUnit.test('config.get', function(assert) {
  assert.equal(grunt.config.get('foo'), 'bar', 'process templates');
  assert.equal(grunt.config.get('foo2'), 'bar', 'process templates recursively');
  assert.equal(grunt.config.get('obj.foo2'), 'bar', 'process deeply nested templates recursively');
  assert.equal(grunt.config.get(['obj', 'foo2']), 'bar', 'process deeply nested templates recursively');
  assert.deepEqual(grunt.config.get('arr'), ['foo', 'bar'], 'process templates in arrays');
  assert.deepEqual(grunt.config.get('obj.Arr'), ['foo', 'bar'], 'process templates in arrays');
  assert.deepEqual(
    grunt.config.get('arr2'),
    [['foo', 'bar'], ['foo', 'bar']],
    'expand <%= arr %> and <%= obj.Arr %> values as objects if possible'
  );
  assert.deepEqual(
    grunt.config.get(['obj', 'arr2']),
    [['foo', 'bar'], ['foo', 'bar']],
    'expand <%= arr %> and <%= obj.Arr %> values as objects if possible'
  );

  var buf = grunt.config.get('buffer');
  assert.true(Buffer.isBuffer(buf), 'retrieve Buffer instances as Buffer');
  assert.strictEqual(buf.toString('utf8'), 'test', 'return buffers as-is');
});

QUnit.test('config.set', function(assert) {
  assert.equal(grunt.config.set('foo3', '<%= foo2 %>'), '<%= foo2 %>', 'Should set values');
  assert.equal(grunt.config.getRaw('foo3'), '<%= foo2 %>', 'Should have set the value');
  assert.equal(grunt.config.data.foo3, '<%= foo2 %>', 'Should have set the value');
  assert.equal(grunt.config.set('a.b.c', '<%= foo2 %>'), '<%= foo2 %>', 'Should create interim objects');
  assert.equal(grunt.config.getRaw('a.b.c'), '<%= foo2 %>', 'Should have set the value');
  assert.equal(grunt.config.data.a.b.c, '<%= foo2 %>', 'Should have set the value');
});

QUnit.test('config.merge', function(assert) {
  assert.deepEqual(grunt.config.merge({}), grunt.config.getRaw(), 'Should return internal data object');

  grunt.config.set('obj', { a: 12 });
  grunt.config.merge({
    foo: 'test',
    baz: '123',
    obj: { a: 34, b: 56 }
  });

  assert.deepEqual(grunt.config.getRaw('foo'), 'test', 'Should overwrite existing properties');
  assert.deepEqual(grunt.config.getRaw('baz'), '123', 'Should add new properties');
  assert.deepEqual(grunt.config.getRaw('obj'), { a: 34, b: 56 }, 'Should deep merge');
});

QUnit.test('config', function(assert) {
  assert.equal(grunt.config('foo'), 'bar', 'Should retrieve processed data');
  assert.equal(grunt.config('obj.foo2'), 'bar', 'Should retrieve processed data');
  assert.equal(grunt.config(['obj', 'foo2']), 'bar', 'Should retrieve processed data');
  assert.deepEqual(grunt.config('arr'), ['foo', 'bar'], 'Should process templates in arrays');

  assert.equal(grunt.config('foo3', '<%= foo2 %>'), '<%= foo2 %>', 'Should set values');
  assert.equal(grunt.config.getRaw('foo3'), '<%= foo2 %>', 'Should have set the value');
  assert.equal(grunt.config.data.foo3, '<%= foo2 %>', 'Should have set the value');
  assert.equal(grunt.config('a.b.c', '<%= foo2 %>'), '<%= foo2 %>', 'Should create interim objects');
  assert.equal(grunt.config.getRaw('a.b.c'), '<%= foo2 %>', 'Should have set the value');
  assert.equal(grunt.config.data.a.b.c, '<%= foo2 %>', 'Should have set the value');
});

QUnit.test('config.requires', function(assert) {
  grunt.log.muted = true;

  // This property exists
  grunt.config.requires('foo');
  grunt.config.requires('obj.foo');
  grunt.config.requires('foo', 'obj.foo', 'obj.foo2');
  grunt.config.requires('foo', ['obj', 'foo'], ['obj', 'foo2']);

  assert.throws(function() { grunt.config.requires('xyz'); }, 'Does not exist');
  assert.throws(function() { grunt.config.requires('obj.xyz'); }, 'Does not exist');
  assert.throws(function() { grunt.config.requires('foo', 'obj.foo', 'obj.xyz'); }, 'One does not exist');
  assert.throws(function() { grunt.config.requires('foo', ['obj', 'foo'], ['obj', 'xyz']); }, 'One does not exist');
});

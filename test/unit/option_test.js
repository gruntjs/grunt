'use strict';

var grunt = require('../../lib/grunt');

QUnit.module('option', {
  beforeEach: function() {
    grunt.option.init();
  },
  afterEach: function() {
    grunt.option.init();
  }
});

QUnit.test('option.init', function(assert) {
  var expected = { foo: 'bar', bool: true, bar: { foo: 'bar' } };

  assert.deepEqual(grunt.option.init(expected), expected);
});

QUnit.test('option', function(assert) {
  assert.equal(grunt.option('foo', 'bar'), grunt.option('foo'));

  grunt.option('foo', { foo: 'bar' });
  assert.deepEqual(grunt.option('foo'), { foo: 'bar' });

  assert.strictEqual(grunt.option('no-there'), false);

  grunt.option('there', false);
  assert.strictEqual(grunt.option('no-there'), true);
});

QUnit.test('option.flags', function(assert) {
  grunt.option.init({
    foo: 'bar',
    there: true,
    obj: { foo: 'bar' },
    arr: []
  });

  assert.deepEqual(grunt.option.flags(), [
    '--foo=bar',
    '--there',
    '--obj=[object Object]'
  ]);
});

QUnit.test('option.keys', function(assert) {
  grunt.option.init({
    foo: 'bar',
    there: true,
    obj: { foo: 'bar' },
    arr: []
  });

  assert.deepEqual(grunt.option.keys(), ['foo', 'there', 'obj', 'arr']);
});

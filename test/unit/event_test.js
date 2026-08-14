'use strict';

var grunt = require('../../lib/grunt');

QUnit.module('event');
QUnit.test('event', function(assert) {
  grunt.event.on('test.foo', function(a, b, c) {
    // This should get executed once (emit test.foo).
    assert.step('foo: ' + a + b + c);
  });
  grunt.event.on('test.*', function(a, b, c) {
    // This should get executed twice (emit test.foo and test.bar).
    assert.step('wildcard: ' + a + b + c);
  });

  grunt.event.emit('test.foo', '1', '2', '3');
  grunt.event.emit('test.bar', '1', '2', '3');

  assert.verifySteps([
    'foo: 123',
    'wildcard: 123',
    'wildcard: 123'
  ]);
});

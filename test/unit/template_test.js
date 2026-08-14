'use strict';

var grunt = require('../../lib/grunt');

QUnit.module('template', function() {
  QUnit.test('process', function(assert) {
    var obj = {
      foo: 'c',
      bar: 'b<%= foo %>d',
      baz: 'a<%= bar %>e'
    };

    assert.equal(grunt.template.process('<%= foo %>', {data: obj}), 'c', 'retrieve value');
    assert.equal(grunt.template.process('<%= bar %>', {data: obj}), 'bcd', 'recurse');
    assert.equal(grunt.template.process('<%= baz %>', {data: obj}), 'abcde', 'recurse');

    obj.foo = '<% oops %';
    assert.equal(grunt.template.process('<%= baz %>', {data: obj}), 'ab<% oops %de', 'not explode');
  });

  QUnit.test('custom delimiters', function(assert) {
    var obj = {
      foo: 'c',
      bar: 'b{%= foo %}d',
      baz: 'a{%= bar %}e'
    };

    assert.equal(grunt.template.process('{%= foo %}', {data: obj, delimiters: 'custom'}), '{%= foo %}', 'custom delimiters have yet to be defined');

    // Define custom delimiters.
    grunt.template.addDelimiters('custom', '{%', '%}');

    assert.equal(grunt.template.process('{%= foo %}', {data: obj, delimiters: 'custom'}), 'c', 'retrieve value');
    assert.equal(grunt.template.process('{%= bar %}', {data: obj, delimiters: 'custom'}), 'bcd', 'recurse');
    assert.equal(grunt.template.process('{%= baz %}', {data: obj, delimiters: 'custom'}), 'abcde', 'recurse');

    assert.equal(grunt.template.process('{%= foo %}<%= foo %>', {data: obj, delimiters: 'custom'}), 'c<%= foo %>', 'should ignore default delimiters');

    obj.foo = '{% oops %';
    assert.equal(grunt.template.process('{%= baz %}', {data: obj, delimiters: 'custom'}), 'ab{% oops %de', 'not explode');
  });
});

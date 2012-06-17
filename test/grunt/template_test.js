'use strict';

var grunt = require('../../lib/grunt');

exports['template'] = {
  'process': function(test) {
    test.expect(4);
    var obj = {
      foo: 'c',
      bar: 'b<%= foo %>d',
      baz: 'a<%= bar %>e'
    };

    test.equal(grunt.template.process('<%= foo %>', obj), 'c', 'should retrieve value.');
    test.equal(grunt.template.process('<%= bar %>', obj), 'bcd', 'should recurse.');
    test.equal(grunt.template.process('<%= baz %>', obj), 'abcde', 'should recurse.');

    obj.foo = '<% oops %';
    test.equal(grunt.template.process('<%= baz %>', obj), 'ab<% oops %de', 'should not explode.');
    test.done();
  },

  'init mode': function(test) {
    test.expect(5);
    var obj = {
      foo: 'c',
      bar: 'b{%= foo %}d',
      baz: 'a{%= bar %}e'
    };

    test.equal(grunt.template.process('{%= foo %}', obj, {delimiters: 'init'}), 'c', 'should retrieve value.');
    test.equal(grunt.template.process('{%= bar %}', obj, {delimiters: 'init'}), 'bcd', 'should recurse.');
    test.equal(grunt.template.process('{%= baz %}', obj, {delimiters: 'init'}), 'abcde', 'should recurse.');

    test.equal(grunt.template.process('{%= foo %}<%= foo %>', obj, {delimiters: 'init'}), 'c<%= foo %>', 'should ignore default delimiters');

    obj.foo = '{% oops %';
    test.equal(grunt.template.process('{%= baz %}', obj, {delimiters: 'init'}), 'ab{% oops %de', 'should not explode.');

    test.done();
  },

  'user mode': function(test) {
    test.expect(5);
    var obj = {
      foo: 'c',
      bar: 'b[%= foo %]d',
      baz: 'a[%= bar %]e'
    };

    test.equal(grunt.template.process('[%= foo %]', obj, {delimiters: 'user'}), 'c', 'should retrieve value.');
    test.equal(grunt.template.process('[%= bar %]', obj, {delimiters: 'user'}), 'bcd', 'should recurse.');
    test.equal(grunt.template.process('[%= baz %]', obj, {delimiters: 'user'}), 'abcde', 'should recurse.');

    test.equal(grunt.template.process('[%= foo %]<%= foo %>', obj, {delimiters: 'user'}), 'c<%= foo %>', 'should ignore default delimiters');

    obj.foo = '[% oops %';
    test.equal(grunt.template.process('[%= baz %]', obj, {delimiters: 'user'}), 'ab[% oops %de', 'should not explode.');
    test.done();
  }
};

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

    test.equal(grunt.template.process('{%= foo %}', obj, 'init'), 'c', 'should retrieve value.');
    test.equal(grunt.template.process('{%= bar %}', obj, 'init'), 'bcd', 'should recurse.');
    test.equal(grunt.template.process('{%= baz %}', obj, 'init'), 'abcde', 'should recurse.');
    
    test.equal(grunt.template.process('{%= foo %}<%= foo %>', obj, 'init'), 'c<%= foo %>', 'should ignore default delimiters');

    obj.foo = '{% oops %';
    test.equal(grunt.template.process('{%= baz %}', obj, 'init'), 'ab{% oops %de', 'should not explode.');
    
    test.done();
  },
  
  'user mode': function(test) {
    test.expect(5);
    var obj = {
      foo: 'c',
      bar: 'b[%= foo %]d',
      baz: 'a[%= bar %]e'
    };

    test.equal(grunt.template.process('[%= foo %]', obj, 'user'), 'c', 'should retrieve value.');
    test.equal(grunt.template.process('[%= bar %]', obj, 'user'), 'bcd', 'should recurse.');
    test.equal(grunt.template.process('[%= baz %]', obj, 'user'), 'abcde', 'should recurse.');
    
    test.equal(grunt.template.process('[%= foo %]<%= foo %>', obj, 'user'), 'c<%= foo %>', 'should ignore default delimiters');

    obj.foo = '[% oops %';
    test.equal(grunt.template.process('[%= baz %]', obj, 'user'), 'ab[% oops %de', 'should not explode.');
    test.done();
  }
};

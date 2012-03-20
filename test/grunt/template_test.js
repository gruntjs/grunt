var grunt = require('../../lib/grunt');
var template = grunt.template;

exports['template'] = {
  'process': function(test) {
    test.expect(4);
    var obj = {
      foo: 'b',
      bar: 'a<%= foo %>c',
      baz: 'x<%= bar %>z'
    };

    test.equal(template.process('<%= foo %>', obj), 'b', 'should retrieve value.');
    test.equal(template.process('<%= bar %>', obj), 'abc', 'should recurse.');
    test.equal(template.process('<%= baz %>', obj), 'xabcz', 'should recurse.');

    obj.foo = '<% oops %';
    test.equal(template.process('<%= baz %>', obj), 'xa<% oops %cz', 'should not explode.');
    test.done();
  }
};

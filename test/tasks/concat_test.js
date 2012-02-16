exports['concat'] = function(test) {
  test.expect(1);
  task.registerHelper('test_helper', function(a, b) { return a + b; });
  var files = [
    'test/fixtures/a.js',
    '<test_helper:x:y>',
    'test/fixtures/b.js'
  ];
  var lf = util.linefeed;
  test.equal(task.helper('concat', files), 'var a = 1;\n' + lf + 'xy' + lf + 'var b = 2;\n', 'It should concatenate files and directives.');
  test.done();
};

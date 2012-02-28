exports['{%= name %}'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'helper': function(test) {
    test.expect(1);
    // tests here
    test.equal(task.helper('{%= name %}'), '{%= name %}!!!', 'should return the correct value.');
    test.done();
  }
};

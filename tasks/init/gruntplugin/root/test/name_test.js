exports['{%= short_name %}'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'helper': function(test) {
    test.expect(1);
    // tests here
    test.equal(task.helper('{%= short_name %}'), '{%= short_name %}!!!', 'should return the correct value.');
    test.done();
  }
};

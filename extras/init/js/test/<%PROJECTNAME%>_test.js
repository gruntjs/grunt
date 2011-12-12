/*global require:true, exports:true */
var <%SAFENAME:PROJECTNAME%> = require('../lib/<%PROJECTNAME%>');

exports['module_name'] = {
  setUp: function(done) {
    // Setup code here.
    done();
  },
  'test_name': function(test) {
    test.expect(1);
    // Test code here.
    test.strictEqual(<%SAFENAME:PROJECTNAME%>.awesome(), 'awesome', 'should be awesome');
    test.done();
  }
};

var grunt = require('../../lib/grunt');

exports['event'] = {
  
  'logerror': function(test) {
    test.expect(1);
    var message = 'Error Message';
    
    grunt.event.on('log.error', function(msg){
      test.equal(message, msg);
    });
    
    grunt.log.error(message);
    test.done();
  },

  'customevent': function(test) {
    test.expect(1);
    var message = 'Custom Message';
    
    grunt.event.on('some.event', function(msg){
      test.equal(message, msg);
    });
    
    grunt.event.emit('some.event', message);
    test.done();
  },

  'uncaughtevent': function(test) {
    test.expect(1);
    var message = 'Custom Message';
    
    // Should not throw an error
    grunt.event.emit('uncaght.event', message);
    test.ok(true);
    test.done();
  }
};
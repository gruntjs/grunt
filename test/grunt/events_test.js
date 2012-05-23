var grunt = require('../../lib/grunt');

exports['events'] = {
  
  'logerror': function(test) {
    test.expect(1);
    var message = 'Error Message';
    
    grunt.events.on('log.error', function(msg){
      test.equal(message, msg);
    });
    
    grunt.log.error(message);
    test.done();
  },

  'customevent': function(test) {
    test.expect(1);
    var message = 'Custom Message';
    
    grunt.events.on('some.event', function(msg){
      test.equal(message, msg);
    });
    
    grunt.events.emit('some.event', message);
    test.done();
  },

  'uncaughtevent': function(test) {
    test.expect(1);
    var message = 'Custom Message';
    
    // Should not throw an error
    grunt.events.emit('uncaght.event', message);
    test.ok(true);
    test.done();
  }
};
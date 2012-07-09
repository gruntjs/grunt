'use strict';

var grunt = require('../../lib/grunt');

// In case the grunt being used to test is different than the grunt being
// tested, initialize the task and config subsystems.
if (grunt.task.searchDirs.length === 0) {
  grunt.task.init([]);
  grunt.config.init({});
}

// Helper for testing stdout
var hookEqual = function(test, expected) {
  var oldout = process.stdout.write;
  process.stdout.write = function(string, encoding, fd) {};
  grunt.util.hooker.hook(process.stdout, 'write', {
    pre: function(result) {
      if (!grunt.util._.isBlank(result)) {
        process.stdout.write = oldout;
        grunt.util.hooker.unhook(process.stdout, 'write');
        test.equal(grunt.log.uncolor(result), expected);
      }
    }
  });
};

exports['log'] = {
  'setUp': function(done) {
    grunt.log.muted = false;
    done();
  },
  'write': function(test) {
    test.expect(2);

    hookEqual(test, 'foo');
    grunt.log.write('foo');

    hookEqual(test, 'foo\n');
    grunt.log.writeln('foo');

    test.done();
  },
  'error': function(test) {
    test.expect(4);

    hookEqual(test, 'ERROR\n');
    grunt.log.error();

    hookEqual(test, '>> FOOBAR\n');
    grunt.log.error('FOOBAR');

    var expected = '>> ' +
      grunt.util._.repeat('foo', 19, ' ') +
      '\n>> ' +
      grunt.util._.repeat('foo', 11, ' ') +
      '\n';
    hookEqual(test, expected);
    grunt.log.errorlns(grunt.util._.repeat('foo', 30, ' '));

    hookEqual(test, 'foo\n');
    grunt.log.fail('foo');

    test.done();
  },
  'ok': function(test) {
    test.expect(4);

    hookEqual(test, 'OK\n');
    grunt.log.ok();

    hookEqual(test, '>> FOOBAR\n');
    grunt.log.ok('FOOBAR');

    var expected = '>> ' +
      grunt.util._.repeat('foo', 19, ' ') +
      '\n>> ' +
      grunt.util._.repeat('foo', 11, ' ') +
      '\n';
    hookEqual(test, expected);
    grunt.log.oklns(grunt.util._.repeat('foo', 30, ' '));

    hookEqual(test, 'foo\n');
    grunt.log.success('foo');

    test.done();
  },
  'header and subhead': function(test) {
    test.expect(2);

    hookEqual(test, 'foo\n');
    grunt.log.header('foo');

    hookEqual(test, 'foo\n');
    grunt.log.subhead('foo');

    test.done();
  },
  'debug': function(test) {
    test.expect(1);

    grunt.option('debug', true);
    hookEqual(test, '[D] foo\n');
    grunt.log.debug('foo');
    grunt.option.init();

    test.done();
  },
  'writetableln': function(test) {
    test.expect(1);

    hookEqual(test, 'foofoofoof\noofoofoofo\nofoofoofoo\n');
    grunt.log.writetableln([10], [grunt.util._.repeat('foo', 10)]);

    test.done();
  },
  'writelns': function(test) {
    test.expect(1);

    var expected = grunt.util._.repeat('foo', 20, ' ') +
      '\n' +
      grunt.util._.repeat('foo', 10, ' ') +
      '\n';
    hookEqual(test, expected);
    grunt.log.writelns(grunt.util._.repeat('foo', 30, ' '));

    test.done();
  },
  'writeflags': function(test) {
    test.expect(1);

    hookEqual(test, 'test: foo, bar\n');
    grunt.log.writeflags(['foo', 'bar'], 'test');

    test.done();
  }
};


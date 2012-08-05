'use strict';

var grunt = require('../../lib/grunt');
var path = require('path');

// In case the grunt being used to test is different than the grunt being
// tested, initialize the task and config subsystems.
if (grunt.task.searchDirs.length === 0) {
  grunt.task.init([]);
  grunt.config.init({});
}

// helper for creating assertTasks for testing tasks in child processes
function assertTask(task, options) {
  var spawn = require('child_process').spawn;
  task = task || 'default';
  options = options || {};

  // get grunt command
  var gruntBin = path.resolve(__dirname, '..', '..', 'bin', 'grunt');
  if (process.platform === 'win32') { gruntBin += '.cmd'; }

  // get next/kill process trigger
  var trigger = options.trigger || 'Waiting...';
  delete options.trigger;

  // turn options into spawn options
  var spawnOptions = [];
  grunt.util._.each(options, function(val, key) {
    spawnOptions.push('--' + key);
    spawnOptions.push(val);
  });
  spawnOptions.push(task);

  // Return an interface for testing this task
  return function(runs, done) {
    var spawnGrunt = spawn(gruntBin, spawnOptions);
    var out = '';

    if (!grunt.util._.isArray(runs)) {
      runs = [runs];
    }

    // After watch starts waiting, run our commands then exit
    spawnGrunt.stdout.on('data', function(data) {
      data = grunt.log.uncolor(String(data));
      out += data;
      // sometimes the data comes in too fast so we use the last line
      var last = grunt.util._.trim(data.split('\n').slice(-1));
      if (last === trigger) {
        if (runs.length < 1) {
          spawnGrunt.kill('SIGINT');
        } else {
          setTimeout(function() {
            runs.shift()();
          }, 500);
        }
      }
    });

    // Throw errors for better testing
    spawnGrunt.stderr.on('data', function(data) {
      throw new Error(data);
    });

    // On process exit return what has been outputted
    spawnGrunt.on('exit', function() {
      done(out);
    });
  };
}

// Create an assertion for the watch task
var assertWatch = assertTask('watch', {
  trigger: 'Waiting...',
  base: path.resolve(__dirname, '..', 'fixtures'),
  gruntfile: path.resolve(__dirname, '..', 'fixtures', 'watch_gruntfile.js')
});

exports['watch'] = {
  'setUp': function(done) {
    this.tmpdir = path.resolve(__dirname, '..', 'fixtures', 'watch');
    grunt.file.write(path.join(this.tmpdir, 'watch.js'), 'var test;');
    grunt.file.write(path.join(this.tmpdir, 'dontwatch.js'), 'var test;');
    grunt.file.write(path.join(this.tmpdir, 'test', 'foo_test.js'), [
      'var foo = require("../foo");',
      'exports.foo = function(test) {',
      'test.equal(foo, "bar");',
      'test.done();',
      '};'
    ].join('\n'));
    done();
  },
  'tearDown': function(done) {
    grunt.file.delete(this.tmpdir);
    done();
  },
  'watch until file changed and report missing semicolon jshint error': function(test) {
    test.expect(1);
    var tmpdir = this.tmpdir;
    assertWatch(function() {
      var write = 'var test = "' + new Date() + '"';
      grunt.file.write(path.join(tmpdir, 'watch.js'), write);
    }, function(result) {
      test.ok(result.indexOf('Missing semicolon') !== -1, 'Upon change jshint should have detected a missing semicolon.');
      test.done();
    });
  },
  'watch until file deleted and run the lint task': function(test) {
    test.expect(1);
    var tmpdir = this.tmpdir;
    assertWatch(function() {
      grunt.file.delete(path.join(tmpdir, 'watch.js'));
    }, function(result) {
      test.ok(true, 'Should run on deleting a file.');
      test.done();
    });
  },
  'watch until file added and report eqeqeq jshint error': function(test) {
    test.expect(1);
    var tmpdir = this.tmpdir;
    assertWatch(function() {
      grunt.file.write(path.join(tmpdir, 'add.js'), 'if (test == true) {}');
    }, function(result) {
      test.ok(result.indexOf("Use '===' to compare with 'true'") !== -1, 'Upon add jshint should have detected ==.');
      test.done();
    });
  },
  'dont run tasks on unwatched files': function(test) {
    test.expect(1);
    var tmpdir = this.tmpdir;
    assertWatch(function() {
      var write = 'var test = "' + new Date() + '"';
      grunt.file.write(path.join(tmpdir, 'dontwatch.js'), write);
      grunt.file.write(path.join(tmpdir, 'watch.js'), write);
    }, function(result) {
      test.equal(result.indexOf('watch/dontwatch.js'), -1, 'Tasks should not have ran when donwatch.js was changed.');
      test.done();
    });
  },
  'nodeunit should evaluate every run when watching': function(test) {
    test.expect(2);
    var tmpdir = this.tmpdir;
    assertWatch([function() {
      grunt.file.write(path.join(tmpdir, 'foo.js'), 'module.exports = "bar";');
    }, function() {
      grunt.file.write(path.join(tmpdir, 'foo.js'), 'module.exports = "notbar";');
    }], function(result) {
      test.ok(result.indexOf('1 assertions passed') !== -1, '1 nodeunit assertion should have passed.');
      test.ok(result.indexOf("AssertionError 'notbar' == 'bar'") !== -1, '1 nodeunit assertion should have failed.');
      test.done();
    });
  }
};
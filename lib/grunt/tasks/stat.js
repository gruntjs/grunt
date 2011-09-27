var stats = require('stats');

var log = grequire('log');
var verbose = log.verbose;

var file = grequire('file');
var fail = grequire('fail');

var task = grequire('task');


task.registerTask('stat', 'Built file statistics', function() {

  var previous = null;

  ['max', 'min'].forEach(function(type) {

    var filepath = __build.build[type];
    var data = stats.parse(file.read(filepath));

    log.writeln(filepath).indent(function() {
      Object.keys(data).forEach(function(key) {

        var msg = key + ': ' + (this[key] + '').yellow;
        var diff;

        if ( previous ) {
          diff = (previous[key] - this[key]);
          msg += (' (-' + (previous[key] - this[key]) + ')').grey;
        }

        log.writeln(msg);
      }, data);
    });

    if ( previous == null ) {
      previous = data;
    }
  });
});
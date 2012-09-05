/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

module.exports = function(grunt) {

  // Nodejs libs.
  var path = require('path');

  // External libs.
  var connect = require('connect');

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerTask('server', 'Start a static web server.', function() {
    // Merge task-specific options with these defaults.
    var options = this.options({
      port: 8000,
      base: '.',
      keepalive: false
    });

    // Connect requires the base path to be absolute.
    var base = path.resolve(options.base);

    // Sweet, sweet middleware.
    var middleware = [
      // Serve static files.
      connect.static(base),
      // Make empty directories browsable. (overkill?)
      connect.directory(base)
    ];

    // If --debug was specified, enable logging.
    if (grunt.option('debug')) {
      connect.logger.format('grunt', ('[D] server :method :url :status ' +
        ':res[content-length] - :response-time ms').magenta);
      middleware.unshift(connect.logger('grunt'));
    }

    // Start server.
    grunt.log.writeln('Starting static web server on port ' + options.port + '.');
    connect.apply(null, middleware).listen(options.port);

    // So many people expect this task to keep alive that I'm adding an option
    // for it. Running the task explicitly as grunt:keepalive will override any
    // value stored in the config. Have fun, people.
    if (this.flags.keepalive || options.keepalive) {
      // This is now an async task. Since we don't store a handle to the "done"
      // function, this task will never, ever, ever terminate. Have fun!
      this.async();
      grunt.log.write('Waiting forever...');
    }
  });

};

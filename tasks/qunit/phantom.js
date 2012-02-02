/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

/*global phantom:true*/

var fs = require('fs');

// The temporary file used for communications.
var tmpfile = phantom.args[0];
// The QUnit helper file to be injected.
var qunit = phantom.args[1];
// The QUnit .html test file to run.
var url = phantom.args[2];

// Keep track of the last time a QUnit message was sent.
var last = new Date();

// Messages are sent to the parent by appending them to the tempfile.
function sendMessage(args) {
  last = new Date();
  fs.write(tmpfile, JSON.stringify(args) + '\n', 'a');
  // Exit when all done.
  if (/^done/.test(args[0])) {
    phantom.exit();
  }
}

// Abort if QUnit doesn't do anything for a while.
setInterval(function() {
  if (new Date() - last > 5000) {
    sendMessage(['done_timeout']);
  }
}, 1000);

// Create a new page.
var page = require('webpage').create();

// QUnit sends its messages via alert(jsonstring);
page.onAlert = function(args) {
  sendMessage(JSON.parse(args));
};

var loaded;
page.open(url, function (status) {
  // Only execute this callback the first time.
  if (loaded) { return; }
  loaded = true;
  // The window has loaded.
  if (status !== 'success') {
    // File loading failure.
    sendMessage(['done_fail', url]);
  } else {
    // Inject QUnit helper file.
    page.injectJs(qunit);
    // Because this happens after window load, "begin" must be sent manually.
    sendMessage(['begin']);
  }
});

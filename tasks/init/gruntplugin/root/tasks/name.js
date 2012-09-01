/*
 * {%= name %}
 * {%= homepage %}
 *
 * Copyright (c) {%= grunt.template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the grunt documentation for more information regarding task
  // creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  grunt.registerTask('{%= short_name %}', 'Your task description goes here.', function() {
    grunt.log.write('I am the ' + this.name + ' task...').ok();
  });

};

/*
 * {%= full_name %}
 * {%= homepage %}
 *
 * Copyright (c) {%= template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

// Please see the grunt documentation for more information regarding task and
// helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('{%= short_name %}', 'Your task description goes here.', function() {
 log.write(task.helper('{%= short_name %}'));
});

// ============================================================================
// HELPERS
// ============================================================================

task.registerHelper('{%= short_name %}', function() {
 return '{%= short_name %}!!!';
});

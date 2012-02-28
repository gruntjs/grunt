/*
 * {%= name %}
 * {%= homepage %}
 *
 * Copyright (c) {%= template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('{%= name %}', 'Your task description goes here.', function() {
 log.write(task.helper('{%= name %}'));
});

// ============================================================================
// HELPERS
// ============================================================================

task.registerHelper('{%= name %}', function() {
 return '{%= name %}!!!';
});

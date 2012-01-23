/*
 * {%= name %}
 * {%= homepage %}
 *
 * Copyright (c) {%= template.today('yyyy') %} {%= author_name %}
 * Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.
 */

exports.awesome = function() {
  return 'awesome';
};

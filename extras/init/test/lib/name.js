/*
 * <%= name %>
 * <%= homepage %>
 *
 * Copyright (c) <% print(template.formatToday('yyyy')) %> <%= author_name %>
 * Licensed under the <% print(licenses.join(', ')) %> license<% print(licenses.length === 1 ? '' : 's') %>.
 */

exports.awesome = function() {
  return 'awesome';
};

var dateformat = require('dateformat');

// Miscellanous template helpers

exports.formatToday = function(format) {
  return dateformat(new Date(), format);
};

exports.joinItems = function(items, separator) {
  return items.join(typeof separator === 'string' ? separator : ', ');
};

exports.stripBanner = function(src) {
  return src.replace(/^\s*\/\*[\s\S]*?\*\/\s*/, '');
};

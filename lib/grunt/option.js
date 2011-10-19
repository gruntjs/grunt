// The actual option data.
var data = {};

// Get an option value.
exports = module.exports = function(key) {
  var no = key.match(/^no-(.+)$/);
  return no ? data[no[1]] === false : data[key];
};

// A long-cut for getting an option value.
exports.get = exports;

// Set an option value.
exports.set = function(key, value) {
  return (data[key] = value);
};

// Initialize option data.
exports.init = function(obj) {
  return (data = obj || {});
};

// List of options as flags.
exports.flags = function() {
  return Object.keys(data).map(function(key) {
    var val = data[key];
    return '--' + (val === false ? 'no-' : '') + key + (typeof val === 'boolean' ? '' : '=' + val);
  });
};

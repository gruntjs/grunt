(function(exports) {

  // Get the value of a deeply-nested property exist in an object.
  exports.get = function(obj, parts, create) {
    if (typeof parts === 'string') {
      parts = parts.split('.');
    }

    var part;
    while (typeof obj === 'object' && obj && parts.length) {
      part = parts.shift();
      if (!(part in obj) && create) {
        obj[part] = {};
      }
      obj = obj[part];
    }

    return obj;
  };

  // Set a deeply-nested property in an object, creating intermediary objects
  // as we go.
  exports.set = function(obj, parts, value) {
    parts = parts.split('.');

    var prop = parts.pop();
    obj = exports.get(obj, parts, true);
    if (obj && typeof obj === 'object') {
      return obj[prop] = value;
    }
  };

  // Does a deeply-nested property exist in an object?
  exports.exists = function(obj, parts) {
    parts = parts.split('.');

    var prop = parts.pop();
    obj = exports.get(obj, parts);

    return obj != null && typeof obj === 'object' && prop in obj;
  };

}(typeof exports === 'object' && exports || this));

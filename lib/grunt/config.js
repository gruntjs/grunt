var namespace = urequire('namespace');

// The actual config data.
var data;

// Recursively expand config directives.
function expandConfig(value) {
  var expandable = ['config', 'json'];
  var parts;
  if (value instanceof Array) {
    // If value is an array, recurse.
    return value.map(expandConfig);
  } else if (typeof value === 'string') {
    // If value is an expandable directive, expand it if possible.
    parts = task.getDirectiveParts(value) || [];
    return expandable.indexOf(parts[0]) !== -1 ? task.directive(value) : value;
  } else {
    // Neither array or string. Just return the value.
    return value;
  }
}

// Get/set config data. If data hasn't been set, return null. If value was
// passed, set value. If props string wasn't passed, return all data. Otherwise,
// return the prop's value (execute as a directive, when necessary).
exports = module.exports = function(props, value) {
  if (!data) {
    // No config data exists.
    return null;
  } else if (arguments.length === 2) {
    // Two arguments were passed, set the property's value.
    return namespace.set(data, props, value);
  } else if (props) {
    // A property string was passed, get that property's value.
    return expandConfig(namespace.get(data, props));
  } else {
    // Nothing was passed. Return the actual config data, with any expandable
    // directives expanded (shallow, for now).
    value = {};
    Object.keys(data).forEach(function(key) {
      value[key] = expandConfig(data[key]);
    });
    return value;
  }
};

// Has config been initialized?
exports.initialized = function() {
  return !!data;
};

// Initialize config data.
exports.init = function(obj) {
  return (data = obj || {});
};

// Escape any . in name with \. so dot-based namespacing works properly.
exports.escape = function(str) {
  return str.replace(/\./g, '\\.');
};

// Test to see if required config params have been defined. If not, throw an
// exception (use this inside of a task).
exports.requires = function() {
  var props = [].slice.call(arguments);
  var msg = 'Verifying option' + (props.length === 1 ? '' : 's') +
    ' ' + log.wordlist(props) + ' exist' + (props.length === 1 ? 's' : '') +
    ' in config...';
  verbose.write(msg);
  var initialized = config.initialized();
  var failProps = initialized && props.filter(function(prop) { return !config(prop); });
  if (initialized && failProps.length === 0) {
    verbose.ok();
    return true;
  } else {
    verbose.or.write(msg);
    log.error().error('Unable to process task.');
    if (!initialized) {
      throw {name: 'TaskError', message: 'Unable to load config.'};
    } else {
      throw {name: 'TaskError', message: 'Required config properties "' + failProps.join(' ') + '" missing.'};
    }
  }
};

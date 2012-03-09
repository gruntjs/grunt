/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

// The actual config data.
var data;

// If prop is an array, convert it to a props string.
function getPropString(prop) {
  if (utils.kindOf(prop) === 'array') {
    return prop.map(exports.escape).join('.');
  }
  return prop;
}

// Get/set config data. If data hasn't been set, return null. If value was
// passed, set value. If props string wasn't passed, return all data. Otherwise,
// return the prop's value (execute as a directive, when necessary).
exports = module.exports = function(prop, value) {
  // Abort if no config data exists.
  if (!data) { return null; }
  // If prop is an array, convert it to a prop string.
  prop = getPropString(prop);

  if (arguments.length === 2) {
    // Two arguments were passed, set the property's value.
    return utils.namespace.set(data, prop, value);
  } else if (prop) {
    // A property string/array was passed, get that property's value.
    return utils.namespace.get(data, prop);
  } else {
    // Nothing was passed. Return a shalow clone of the actual config data.
    return utils._.clone(data);
  }
};

// Has config been initialized?
exports.initialized = function() {
  return !!data;
};

// Initialize config data.
exports.init = function(obj) {
  verbose.write('Initializing config...').ok();
  // Initialize data.
  data = obj || {};
  // Expand data.
  exports.expand();
  // Return data.
  return data;
};

// Recursively expand config directives.
exports.expand = function() {
  // Expand expandable directives.
  var expandable = ['config', 'json'];
  data = utils.recurse(data, function(value) {
    if (typeof value !== 'string') { return value; }
    // If value is an expandable directive, expand it.
    var parts = task.getDirectiveParts(value) || [];
    return expandable.indexOf(parts[0]) !== -1 ? task.directive(value) : value;
  });
};

// Escape any . in name with \. so dot-based namespacing works properly.
exports.escape = function(str) {
  return str.replace(/\./g, '\\.');
};

// Test to see if required config params have been defined. If not, throw an
// exception (use this inside of a task).
exports.requires = function() {
  var props = utils.toArray(arguments).map(getPropString);
  var msg = 'Verifying option' + (props.length === 1 ? '' : 's') +
    ' ' + log.wordlist(props) + ' exist' + (props.length === 1 ? 's' : '') +
    ' in config...';
  verbose.write(msg);
  var initialized = exports.initialized();
  var failProps = initialized && props.filter(function(prop) {
    return exports(prop) === undefined;
  }).map(function(prop) {
    return '"' + prop + '"';
  });
  if (initialized && failProps.length === 0) {
    verbose.ok();
    return true;
  } else {
    verbose.or.write(msg);
    log.error().error('Unable to process task.');
    if (!initialized) {
      throw task.taskError('Unable to load config.');
    } else {
      throw task.taskError('Required config propert' +
        (failProps.length === 1 ? 'y' : 'ies') + ' ' + failProps.join(', ') +
        ' missing.');
    }
  }
};

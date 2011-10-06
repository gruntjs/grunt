var namespace = urequire('namespace');

// The actual config data.
var data;

// Get config data.
exports = module.exports = function(props) {
  return data ? namespace.get(data, props) : false;
};

// A long-cut for getting config data.
exports.get = exports;

// Set config data.
exports.set = function(props, value) {
  if (data) {
    namespace.set(data, props, value);
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

// Test to see if required config params have been defined.
exports.needs = function() {
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
    log.error().indent();
    if (!initialized) {
      log.error('Unable to load config.');
    } else {
      failProps.forEach(function(prop) {
        log.error('Required property "' + prop + '" missing.');
      });
    }
    fail.warn('Unable to continue.');
    log.unindent();
  }
};

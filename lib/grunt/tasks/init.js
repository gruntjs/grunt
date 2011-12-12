var path = require('path');
var fs = require('fs');
var template = grequire('template');

// ============================================================================
// TASKS
// ============================================================================

task.registerTask('init', 'Create project scaffolding in the current directory.', function(name) {
  // "init" task extras.
  var extrasdir = extraspath('init');
  // All available templates.
  var templates = fs.readdirSync(extrasdir);

  // Abort if a valid template wasn't specified.
  if (!name || templates.indexOf(name) === -1) {
    fail.fatal('A valid template (' + templates.join(', ') + ') must be specified.');
  }

  // Abort if the current directory isn't empty!
  if (fs.readdirSync(process.cwd()).length > 0) {
    fail.warn('The current directory is not empty.');
  }

  // TODO: read data.
  var initData = {
    PROJECTNAME: 'jquery-super-awesome',
    GITNAME: 'cowboy',
    USERNAME: 'Ben Alman',
    USEREMAIL: 'cowboy@rj3.net'
  };

  // For each
  file.recurse(path.join(extrasdir, name), function(srcpath, rootdir, subdir, filename) {
    if (subdir) {
      subdir = task.helper('init_template', subdir, initData);
      //console.log("mkdir", subdir);
      file.mkdir(subdir);
    }
    filename = task.helper('init_template', filename, initData);
    var abspath = path.join(process.cwd(), subdir, filename);

    var src = task.helper('init_template', file.read(srcpath), initData);

    //console.log("write", abspath);
    file.write(abspath, src);
  });
});

// ============================================================================
// HELPERS
// ============================================================================

function getData() {
  // git config --get github.user = cowboy
  // git config --get user.name = Ben Alman
  // git config --get user.email = cowboy@rj3.net
  var data = {
    PROJECTNAME: 'super-awesome',
    GITNAME: 'cowboy',
    USERNAME: 'Ben Alman',
    USEREMAIL: 'cowboy@rj3.net'
  };
  return data;
}

var helpers = {
  SAFENAME: function(prop) {
    var value = this[prop] || '';
    return value.replace(/(?:(^\s*$|^\d\W*)|\W+)(.?)/g, function(_, a, b) {
      return (a != null ? 'x' + a : '') + b.toUpperCase();
    });
  },
  TODAY: template.formatToday
};

task.registerHelper('init_template', function(str, data) {
  return str.replace(/<%\s*([^%]+?)\s*%>/g, function(_, match) {
    var parts = match.split(':');
    var prop = parts.shift();
    var value = helpers[prop] || data[prop];
    return typeof value === 'function' ? value.apply(data, parts) : value;
  });
});

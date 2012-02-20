/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var fs = require('fs');
var path = require('path');

var semver = require('semver');

var prompt = require('prompt');
prompt.message = '[' + '?'.green + ']';
prompt.delimiter = ' ';

// ============================================================================
// TASKS
// ============================================================================

// An array of all available license files.
function availableLicenses() {
  return file.taskpaths('init/licenses').reduce(function(arr, filepath) {
    return arr.concat(fs.readdirSync(filepath).map(function(filename) {
      return filename.replace(/^LICENSE-/, '');
    }));
  }, []);
}

task.registerInitTask('init', 'Generate project scaffolding from a predefined template.', function() {
  // Extra arguments will be applied to the template file.
  var args = util.toArray(arguments);
  // Template name.
  var name = args.shift();
  // Valid init templates (.js files).
  var templates = {};
  // Template-related search paths.
  var searchpaths = [];
  // Iterate over all available init-specific extras paths, building templates
  // object and searchpaths index.
  this.extraspaths().reverse().forEach(function(dirpath) {
    var obj = {path: dirpath, subdirs: []};
    searchpaths.unshift(obj);
    // Iterate over all files inside init-specific extras paths.
    fs.readdirSync(dirpath).forEach(function(filename) {
      var filepath = path.join(dirpath, filename);
      if (fs.statSync(filepath).isDirectory()) {
        // Push init subdirs into searchpaths subdirs array for later use.
        obj.subdirs.push(filename);
      } else if (fs.statSync(filepath).isFile() && path.extname(filepath) === '.js') {
        // Add template (plus its path) to the templates object.
        templates[path.basename(filename, '.js')] = path.join(dirpath, filename);
      }
    });
  });

  // Abort if a valid template was not specified.
  if (!(name && name in templates)) {
    log.error('A valid template name must be specified. Valid templates are: ' +
      log.wordlist(Object.keys(templates)) + '.');
    return false;
  }

  // Abort if a gruntfile was found (to avoid accidentally nuking it).
  if (path.existsSync(path.join(process.cwd(), 'grunt.js'))) {
    fail.warn('Beware, grunt.js file already exists.');
  }

  // This task is asynchronous.
  var taskDone = this.async();

  // Useful init sub-task-specific utilities.
  var init = {
    // Expose any user-specified default init values.
    defaults: file.taskfileDefaults('init/defaults.json'),
    // Expose rename rules for this template.
    renames: file.taskfileDefaults('init', name, 'rename.json'),
    // Return an object containing files to copy with their absolute source path
    // and relative destination path, renamed (or omitted) according to rules in
    // rename.json (if it exists).
    filesToCopy: function(props) {
      var files = {};
      var prefix = 'init/' + name + '/root/';
      // Iterate over all source files.
      file.taskfiles('init', name, 'root', '**').forEach(function(obj) {
        // Get the path relative to the template root.
        var relpath = obj.rel.slice(prefix.length);
        var rule = init.renames[relpath];
        // Omit files that have an empty / false rule value.
        if (!rule && relpath in init.renames) { return; }
        // Create an object for this file.
        files[relpath] = {
          src: obj.abs,
          // Rename if a rule exists.
          dest: rule ? template.process(rule, props, 'init') : relpath
        };
      });
      return files;
    },
    // Search init template paths for filename.
    srcpath: function() {
      var args = ['init', name, 'root'].concat(util.toArray(arguments));
      var obj = file.taskfile.apply(file, args);
      return obj ? String(obj) : null;
    },
    // Determine absolute destination file path.
    destpath: path.join.bind(path, process.cwd()),
    // Given some number of licenses, add properly-named license files to the
    // files object.
    addLicenseFiles: function(files, licenses) {
      var available = availableLicenses();
      licenses.forEach(function(license) {
        var srcpath = file.taskfile('init/licenses/LICENSE-' + license);
        files['LICENSE-' + license] = {
          src: srcpath ? String(srcpath) : null,
          dest: 'LICENSE-' + license
        };
      });
    },
    // Given an absolute or relative source path, and an optional relative
    // destination path, copy a file, optionally processing it through the
    // passed callback.
    copy: function(srcpath, destpath, callback) {
      if (typeof destpath !== 'string') {
        callback = destpath;
        destpath = srcpath;
      }
      var abssrcpath = file.isPathAbsolute(srcpath) ? srcpath : init.srcpath(srcpath);
      var absdestpath = init.destpath(destpath);
      if (!path.existsSync(abssrcpath)) {
        abssrcpath = file.taskfile('init/misc/placeholder');
      }
      verbose.or.write('Writing ' + destpath + '...');
      try {
        file.copy(abssrcpath, absdestpath, callback);
        verbose.or.ok();
      } catch(e) {
        verbose.or.error();
        throw e;
      }
    },
    // Iterate over all files in the passed object, copying the source file to
    // the destination, processing the contents.
    copyAndProcess: function(files, props) {
      Object.keys(files).forEach(function(key) {
        var obj = files[key];
        init.copy(obj.src, obj.dest, function(contents) {
          return template.process(contents, props, 'init');
        });
      });
    },
    // Save a package.json file in the destination directory. The callback
    // can be used to post-process properties to add/remove/whatever.
    writePackage: function(filename, props, callback) {
      var pkg = {};
      // Basic values.
      ['name', 'title', 'description', 'version', 'homepage'].forEach(function(prop) {
        if (prop in props) { pkg[prop] = props[prop]; }
      });
      // Author.
      ['name', 'email', 'url'].forEach(function(prop) {
        if (props['author_' + prop]) {
          if (!pkg.author) { pkg.author = {}; }
          pkg.author[prop] = props['author_' + prop];
        }
      });
      // Other stuff.
      if ('repository' in props) { pkg.repository = {type: 'git', url: props.repository}; }
      if ('bugs' in props) { pkg.bugs = {url: props.bugs}; }
      pkg.licenses = props.licenses.map(function(license) {
        return {type: license, url: props.homepage + '/blob/master/LICENSE-' + license};
      });
      pkg.dependencies = {};
      pkg.devDependencies = {};
      pkg.keywords = [];
      // Node/npm-specific (?)
      if (props.node_version) { pkg.engines = {node: props.node_version}; }
      if (props.node_main) { pkg.main = props.node_main; }
      if (props.node_test) {
        pkg.scripts = {test: props.node_test};
        if (props.node_test.split(' ')[0] === 'grunt') {
          pkg.devDependencies.grunt = '~' + grunt.version;
        }
      }

      // Allow final tweaks to the pkg object.
      if (callback) { pkg = callback(pkg, props); }

      // Write file.
      file.write(init.destpath(filename), JSON.stringify(pkg, null, 2));
    }
  };

  // Make args available as flags.
  init.flags = {};
  args.forEach(function(flag) { init.flags[flag] = true; });

  // Execute template code, passing in the init object, done function, and any
  // other arguments specified after the init:name:???.
  require(templates[name]).apply(null, [init, function() {
    // Fail task if errors were logged.
    if (task.hadErrors()) { taskDone(false); }
    // Otherwise, print a success message.
    log.writeln().writeln('Initialized from template "' + name + '".');
    // All done!
    taskDone();
  }].concat(args));
});

// ============================================================================
// HELPERS
// ============================================================================

// Prompt user to override default values passed in obj.
task.registerHelper('prompt', function(defaults, options, done) {
  // If defaults are omitted, shuffle arguments a bit.
  if (util.kindOf(defaults) === 'array') {
    done = options;
    options = defaults;
    defaults = {};
  }

  // Keep track of any "sanitize" functions for later use.
  var sanitize = {};
  options.forEach(function(option) {
    if (option.sanitize) {
      sanitize[option.name] = option.sanitize;
    }
  });

  // Add one final "are you sure?" prompt.
  options.push({
    message: 'Are these answers correct?'.green,
    name: 'ANSWERS_VALID',
    default: 'Y/n'
  });

  // Ask user for input. This is in an IIFE because it has to execute at least
  // once, and might be repeated.
  (function ask() {
    log.subhead('Please answer the following:');
    var result = underscore.clone(defaults);
    // Loop over each prompt option.
    async.forEachSeries(options, function(option, done) {
      // Actually get user input.
      function doPrompt() {
        prompt.start();
        prompt.getInput(option, function(err, line) {
          if (err) { return done(err); }
          result[option.name] = line;
          done();
        });
      }
      // If the default value is a function, execute that function, using the
      // value passed into the return callback as the new default value.
      if (typeof option.default === 'function') {
        option.default(result, function(err, value) {
          // Handle errors (there should never be errors).
          option.default = err ? '???' : value;
          doPrompt();
        });
      } else {
        doPrompt();
      }
    }, function(err) {
      // After all prompt questions have been answered...
      if (/y/i.test(result.ANSWERS_VALID)) {
        // User accepted all answers. Suspend prompt.
        prompt.pause();
        // Clean up.
        delete result.ANSWERS_VALID;
        // Iterate over all results.
        async.forEachSeries(Object.keys(result), function(name, next) {
          // If this value needs to be sanitized, process it now.
          if (sanitize[name]) {
            sanitize[name](result[name], result, function(err, value) {
              if (err) {
                result[name] = err;
              } else if (arguments.length === 2) {
                result[name] = value === 'none' ? '' : value;
              }
              next();
            });
          } else {
            next();
          }
        }, function(err) {
          // Done!
          log.writeln();
          done(err, result);
        });
      } else {
        // Otherwise update the default value for each user prompt option...
        options.slice(0, -1).forEach(function(option) {
          option.default = result[option.name];
        });
        // ...and start over again.
        ask();
      }
    });
  }());
});

// Built-in prompt options for the prompt_for helper.
// These generally follow the node "prompt" module convention, except:
// * The "default" value can be a function which is executed at run-time.
// * An optional "sanitize" function has been added to post-process data.
var prompts = {
  name: {
    message: 'Project name',
    default: function(data, done) {
      var types = ['javascript', 'js'];
      if (data.type) { types.push(data.type); }
      var type = '(?:' + types.join('|') + ')';
      // This regexp matches:
      //   leading type- type. type_
      //   trailing -type .type _type and/or -js .js _js
      var re = new RegExp('^' + type + '[\\-\\._]?|(?:[\\-\\._]?' + type + ')?(?:[\\-\\._]?js)?$', 'ig');
      // Strip the above stuff from the current dirname.
      var name = path.basename(process.cwd()).replace(re, '');
      // Remove anything not a letter, number, dash, dot or underscore.
      name = name.replace(/[^\w\-\.]/g, '');
      done(null, name);
    },
    validator: /^[\w\-\.]+$/,
    warning: 'Name must be only letters, numbers, dashes, dots or underscores.',
    sanitize: function(value, data, done) {
      // An additional value, safe to use as a JavaScript identifier.
      data.js_safe_name = value.replace(/[\W_]+/g, '_').replace(/^(\d)/, '_$1');
      // If no value is passed to `done`, the original property isn't modified.
      done();
    }
  },
  title: {
    message: 'Project title',
    default: function(data, done) {
      var title = data.name || '';
      title = title.replace(/[\W_]+/g, ' ');
      title = title.replace(/\w+/g, function(word) {
        return word[0].toUpperCase() + word.slice(1).toLowerCase();
      });
      title = title.replace(/jquery/i, 'jQuery');
      done(null, title);
    }
  },
  description: {
    message: 'Description',
    default: 'The best project ever.'
  },
  version: {
    message: 'Version',
    default: function(data, done) {
      // Get a valid semver tag from `git describe --tags` if possible.
      task.helper('child_process', {
        cmd: 'git',
        args: ['describe', '--tags']
      }, function(err, result) {
        if (result) {
          result = result.split('-')[0];
        }
        done(null, semver.valid(result) || '0.1.0');
      });
    },
    validator: semver.valid,
    warning: 'Must be a valid semantic version.'
  },
  repository: {
    message: 'Project git repository',
    default: function(data, done) {
      // Change any git@...:... uri to git://.../... format.
      task.helper('git_origin', function(err, result) {
        if (err) {
          // Attempt to guess at the repo name. Maybe we'll get lucky!
          result = 'git://github.com/' + (process.env.USER || '???') + '/' +
            data.name + '.git';
        } else {
          result = result.replace(/^git@([^:]+):/, 'git://$1/');
        }
        done(null, result);
      });
    },
    sanitize: function(value, data, done) {
      // An additional computed "git_user" property.
      var repo = task.helper('github_web_url', data.repository);
      var parts;
      if (repo != null) {
        parts = repo.split('/');
        data.git_user = parts[parts.length - 2];
        done();
      } else {
        // Attempt to pull the data from the user's git config.
        task.helper('child_process', {
          cmd: 'git',
          args: ['config', '--get', 'github.user'],
          fallback: ''
        }, function(err, result) {
          data.git_user = result || process.env.USER || '???';
          done();
        });
      }
    }
  },
  homepage: {
    message: 'Project homepage',
    // If GitHub is the origin, the (potential) homepage is easy to figure out.
    default: function(data, done) {
      done(null, task.helper('github_web_url', data.repository) || 'none');
    }
  },
  bugs: {
    message: 'Project issues tracker',
    // If GitHub is the origin, the issues tracker is easy to figure out.
    default: function(data, done) {
      done(null, task.helper('github_web_url', data.repository, 'issues') || 'none');
    }
  },
  licenses: {
    message: 'Licenses',
    default: 'MIT',
    validator: /^[\w\-]+(?:\s+[\w\-]+)*$/,
    warning: 'Must be one or more space-separated licenses. (eg. ' +
      availableLicenses().join(' ') + ')',
    // Split the string on spaces.
    sanitize: function(value, data, done) { done(value.split(/\s+/)); }
  },
  author_name: {
    message: 'Author name',
    default: function(data, done) {
      // Attempt to pull the data from the user's git config.
      task.helper('child_process', {
        cmd: 'git',
        args: ['config', '--get', 'user.name'],
        fallback: 'none'
      }, done);
    }
  },
  author_email: {
    message: 'Author email',
    default: function(data, done) {
      // Attempt to pull the data from the user's git config.
      task.helper('child_process', {
        cmd: 'git',
        args: ['config', '--get', 'user.email'],
        fallback: 'none'
      }, done);
    }
  },
  author_url: {
    message: 'Author url',
    default: 'none'
  },
  node_version: {
    message: 'What versions of node does it run on?',
    default: '>= ' + process.versions.node
  },
  node_main: {
    message: 'Main module/entry point',
    default: function(data, done) {
      done(null, 'lib/' + data.name);
    }
  },
  node_test: {
    message: 'Test command',
    default: 'grunt test'
  }
};

// Expose prompts object so that prompt_for prompts can be added or modified.
task.registerHelper('prompt_for_obj', function() {
  return prompts;
});

// Commonly-used prompt options with meaningful default values.
task.registerHelper('prompt_for', function(name, alternateDefault) {
  // Clone the option so the original options object doesn't get modified.
  var option = underscore.clone(prompts[name]);
  option.name = name;

  var defaults = file.taskfileDefaults('init/defaults.json');
  if (name in defaults) {
    // A user default was specified for this option, so use its value.
    option.default = defaults[name];
  } else if (arguments.length === 2) {
    // An alternate default was specified, so use it.
    option.default = alternateDefault;
  }
  return option;
});

// Get the git origin url from the current repo (if possible).
task.registerHelper('git_origin', function(done) {
  task.helper('child_process', {
    cmd: 'git',
    args: ['remote', '-v']
  }, function(err, result) {
    var re = /^origin/;
    if (err || !result) {
      done(true, 'none');
    } else {
      result = result.split('\n').filter(re.test.bind(re))[0];
      done(null, result.split(/\s/)[1]);
    }
  });
});

// Generate a GitHub web URL from a GitHub repo URI.
var githubWebUrlRe = /^.+(?:@|:\/\/)(github.com)[:\/](.+?)(?:\.git|\/)?$/;
task.registerHelper('github_web_url', function(uri, suffix) {
  var matches = githubWebUrlRe.exec(uri);
  if (!matches) { return null; }
  var url = 'https://' + matches[1] + '/' + matches[2];
  if (suffix) {
    url += '/' + suffix.replace(/^\//, '');
  }
  return url;
});

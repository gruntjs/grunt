/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

'use strict';

module.exports = function(grunt) {

  // Nodejs libs.
  var path = require('path');

  // External libs.
  var semver = require('semver');

  // Internal libs.
  var git = require('./lib/git').init(grunt);
  var prompt = require('./lib/prompt').init(grunt);

  // ==========================================================================
  // TASKS
  // ==========================================================================

  // An array of all available license files.
  function availableLicenses() {
    return grunt.task.expandFiles('init/licenses/*').map(function(obj) {
      return path.basename(String(obj)).replace(/^LICENSE-/, '');
    });
  }

  grunt.registerInitTask('init', 'Generate project scaffolding from a predefined template.', function() {
    // Extra arguments will be applied to the template file.
    var args = grunt.util.toArray(arguments);
    // Template name.
    var name = args.shift();
    // Default to last-specified grunt.npmTasks plugin name if template name
    // was omitted. Note that specifying just a : after init like "grunt init:"
    // will allow all available templates to be listed.
    if (name == null) {
      name = grunt._npmTasks[grunt._npmTasks.length - 1];
    }
    // Valid init templates (.js or .coffee files).
    var templates = {};
    grunt.task.expandFiles('init/*.{js,coffee}').forEach(function(fileobj) {
      // Add template (plus its path) to the templates object.
      var basename = path.basename(fileobj.abs).replace(/\.(?:js|coffee)/, '');
      templates[basename] = require(fileobj.abs);
    });
    var initTemplate = templates[name];

    // Give the user a little help.
    grunt.log.writelns(
      'This task will create one or more files in the current directory, ' +
      'based on the environment and the answers to a few questions. ' +
      'Note that answering "?" to any question will show question-specific ' +
      'help and answering "none" to most questions will leave its value blank.'
    );

    // Abort if a valid template was not specified.
    if (!initTemplate) {
      grunt.log.writeln();
      if (name) {
        grunt.log.write('Loading "' + name + '" init template...').error();
      }
      grunt.log.writelns('A valid init template name must be specified, eg. ' +
        '"grunt init:commonjs". The currently-available templates are:');
      Object.keys(templates).forEach(function(name) {
        var description = templates[name].description || '(no description)';
        grunt.log.writelns(name.cyan + ' - ' + description);
      });
      return !name;
    }

    // Abort if matching files or directories were found (to avoid accidentally
    // nuking them).
    if (initTemplate.warnOn && grunt.file.expand(initTemplate.warnOn).length > 0) {
      grunt.log.writeln();
      grunt.warn('Existing files may be overwritten!');
    }

    // This task is asynchronous.
    var taskDone = this.async();

    var pathPrefix = 'init/' + name + '/root/';

    // Useful init sub-task-specific utilities.
    var init = {
      // Expose prompt interface on init object.
      process: prompt.process,
      prompt: prompt.prompt,
      prompts: prompt.prompts,
      // Expose any user-specified default init values.
      defaults: grunt.task.readDefaults('init/defaults.json'),
      // Expose rename rules for this template.
      renames: grunt.task.readDefaults('init', name, 'rename.json'),
      // Return an object containing files to copy with their absolute source path
      // and relative destination path, renamed (or omitted) according to rules in
      // rename.json (if it exists).
      filesToCopy: function(props) {
        var files = {};
        // Exclusion patterns.
        var patterns = Object.keys(init.renames).filter(function(key) {
          return !init.renames[key];
        }).map(function(key) {
          return '!' + pathPrefix + key;
        });
        // Inclusion pattern.
        patterns.push(pathPrefix + '**');
        // Iterate over all source files.
        grunt.task.expandFiles({dot: true}, patterns).forEach(function(obj) {
          // Get the source filepath relative to the template root.
          var src = obj.rel.slice(pathPrefix.length);
          // Get the destination filepath.
          var dest = init.renames[src];
          // Create a property for this file.
          files[dest ? grunt.template.process(dest, {data: props, delimiters: 'init'}) : src] = obj.rel;
        });
        return files;
      },
      // Search init template paths for filename.
      srcpath: function(arg1) {
        if (arg1 == null) { return null; }
        var args = ['init', name, 'root'].concat(grunt.util.toArray(arguments));
        return grunt.task.getFile.apply(grunt.file, args);
      },
      // Determine absolute destination file path.
      destpath: path.join.bind(path, process.cwd()),
      // Given some number of licenses, add properly-named license files to the
      // files object.
      addLicenseFiles: function(files, licenses) {
        licenses.forEach(function(license) {
          var fileobj = grunt.task.expandFiles('init/licenses/LICENSE-' + license)[0];
          files['LICENSE-' + license] = fileobj ? fileobj.rel : null;
        });
      },
      // Given an absolute or relative source path, and an optional relative
      // destination path, copy a file, optionally processing it through the
      // passed callback.
      copy: function(srcpath, destpath, options) {
        // Destpath is optional.
        if (typeof destpath !== 'string') {
          options = destpath;
          destpath = srcpath;
        }
        // Ensure srcpath is absolute.
        if (!grunt.file.isPathAbsolute(srcpath)) {
          srcpath = init.srcpath(srcpath);
        }
        // Use placeholder file if no src exists.
        if (!srcpath) {
          srcpath = grunt.task.getFile('init/misc/placeholder');
        }
        grunt.verbose.or.write('Writing ' + destpath + '...');
        try {
          grunt.file.copy(srcpath, init.destpath(destpath), options);
          grunt.verbose.or.ok();
        } catch(e) {
          grunt.verbose.or.error().error(e);
          throw e;
        }
      },
      // Iterate over all files in the passed object, copying the source file to
      // the destination, processing the contents.
      copyAndProcess: function(files, props, options) {
        options = grunt.util._.defaults(options || {}, {
          process: function(contents) {
            return grunt.template.process(contents, {data: props, delimiters: 'init'});
          }
        });
        Object.keys(files).forEach(function(destpath) {
          var o = Object.create(options);
          var srcpath = files[destpath];
          // If srcpath is relative, match it against options.noProcess if
          // necessary, then make srcpath absolute.
          var relpath;
          if (srcpath && !grunt.file.isPathAbsolute(srcpath)) {
            if (o.noProcess) {
              relpath = srcpath.slice(pathPrefix.length);
              o.noProcess = grunt.file.isMatch({matchBase: true}, o.noProcess, relpath);
            }
            srcpath = grunt.task.getFile(srcpath);
          }
          // Copy!
          init.copy(srcpath, destpath, o);
        });
      },
      // Save a package.json file in the destination directory. The callback
      // can be used to post-process properties to add/remove/whatever.
      writePackageJSON: function(filename, props, callback) {
        var pkg = {};
        // Basic values.
        ['name', 'title', 'description', 'version', 'homepage'].forEach(function(prop) {
          if (prop in props) { pkg[prop] = props[prop]; }
        });
        // Author.
        var hasAuthor = Object.keys(props).some(function(prop) {
          return (/^author_/).test(prop);
        });
        if (hasAuthor) {
          pkg.author = {};
          ['name', 'email', 'url'].forEach(function(prop) {
            if (props['author_' + prop]) {
              pkg.author[prop] = props['author_' + prop];
            }
          });
        }
        // Other stuff.
        if ('repository' in props) { pkg.repository = {type: 'git', url: props.repository}; }
        if ('bugs' in props) { pkg.bugs = {url: props.bugs}; }
        if (props.licenses) {
          pkg.licenses = props.licenses.map(function(license) {
            return {type: license, url: props.homepage + '/blob/master/LICENSE-' + license};
          });
        }

        // Node/npm-specific (?)
        if (props.main) { pkg.main = props.main; }
        if (props.bin) { pkg.bin = props.bin; }
        if (props.node_version) { pkg.engines = {node: props.node_version}; }
        if (props.npm_test) {
          pkg.scripts = {test: props.npm_test};
          if (props.npm_test.split(' ')[0] === 'grunt') {
            if (!props.devDependencies) { props.devDependencies = {}; }
            props.devDependencies.grunt = '~' + grunt.version;
          }
        }

        if (props.dependencies) { pkg.dependencies = props.dependencies; }
        if (props.devDependencies) { pkg.devDependencies = props.devDependencies; }
        if (props.keywords) { pkg.keywords = props.keywords; }

        // Allow final tweaks to the pkg object.
        if (callback) { pkg = callback(pkg, props); }

        // Write file.
        grunt.verbose.or.write('Writing ' + filename + '...');
        try {
          grunt.file.write(init.destpath(filename), JSON.stringify(pkg, null, 2));
          grunt.verbose.or.ok();
        } catch(e) {
          grunt.verbose.or.error().error(e);
          throw e;
        }
      }
    };

    // Make args available as flags.
    init.flags = {};
    args.forEach(function(flag) { init.flags[flag] = true; });

    // Show any template-specific notes.
    if (initTemplate.notes) {
      grunt.log.subhead('"' + name + '" template notes:').writelns(initTemplate.notes);
    }

    // Execute template code, passing in the init object, done function, and any
    // other arguments specified after the init:name:???.
    initTemplate.template.apply(this, [grunt, init, function() {
      // Fail task if errors were logged.
      if (grunt.task.current.errorCount) { taskDone(false); }
      // Otherwise, print a success message.
      grunt.log.writeln().writeln('Initialized from template "' + name + '".');
      // All done!
      taskDone();
    }].concat(args));
  });

  // Built-in prompt options.
  // These generally follow the node "prompt" module convention, except:
  // * The "default" value can be a function which is executed at run-time.
  // * An optional "sanitize" function has been added to post-process data.
  grunt.util._.extend(prompt.prompts, {
    name: {
      message: 'Project name',
      default: function(value, data, done) {
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
      warning: 'Must be only letters, numbers, dashes, dots or underscores.',
      sanitize: function(value, data, done) {
        // An additional value, safe to use as a JavaScript identifier.
        data.js_safe_name = value.replace(/[\W_]+/g, '_').replace(/^(\d)/, '_$1');
        // An additional value that won't conflict with NodeUnit unit tests.
        data.js_test_safe_name = data.js_safe_name === 'test' ? 'myTest' : data.js_safe_name;
        // If no value is passed to `done`, the original property isn't modified.
        done();
      }
    },
    title: {
      message: 'Project title',
      default: function(value, data, done) {
        var title = data.name || '';
        title = title.replace(/[\W_]+/g, ' ');
        title = title.replace(/\w+/g, function(word) {
          return word[0].toUpperCase() + word.slice(1).toLowerCase();
        });
        done(null, title);
      },
      warning: 'May consist of any characters.'
    },
    description: {
      message: 'Description',
      default: 'The best project ever.',
      warning: 'May consist of any characters.'
    },
    version: {
      message: 'Version',
      default: function(value, data, done) {
        // Get a valid semver tag from `git describe --tags` if possible.
        grunt.util.spawn({
          cmd: 'git',
          args: ['describe', '--tags'],
          fallback: ''
        }, function(err, result, code) {
          result = String(result).split('-')[0];
          done(null, semver.valid(result) || '0.1.0');
        });
      },
      validator: semver.valid,
      warning: 'Must be a valid semantic version (semver.org).'
    },
    repository: {
      message: 'Project git repository',
      default: function(value, data, done) {
        // Change any git@...:... uri to git://.../... format.
        git.origin(function(err, result) {
          if (err) {
            // Attempt to guess at the repo name. Maybe we'll get lucky!
            result = 'git://github.com/' + (process.env.USER || process.env.USERNAME || '???') + '/' +
              path.basename(process.cwd()) + '.git';
          } else {
            result = result.replace(/^git@([^:]+):/, 'git://$1/');
          }
          done(null, result);
        });
      },
      sanitize: function(value, data, done) {
        // An additional computed "git_user" property.
        var repo = git.githubUrl(data.repository);
        var parts;
        if (repo != null) {
          parts = repo.split('/');
          data.git_user = parts[parts.length - 2];
          done();
        } else {
          // Attempt to pull the data from the user's git config.
          grunt.util.spawn({
            cmd: 'git',
            args: ['config', '--get', 'github.user'],
            fallback: ''
          }, function(err, result, code) {
            data.git_user = String(result) || process.env.USER || process.env.USERNAME || '???';
            done();
          });
        }
      },
      warning: 'Should be a public git:// URI.'
    },
    homepage: {
      message: 'Project homepage',
      // If GitHub is the origin, the (potential) homepage is easy to figure out.
      default: function(value, data, done) {
        done(null, git.githubUrl(data.repository) || 'none');
      },
      warning: 'Should be a public URL.'
    },
    bugs: {
      message: 'Project issues tracker',
      // If GitHub is the origin, the issues tracker is easy to figure out.
      default: function(value, data, done) {
        done(null, git.githubUrl(data.repository, 'issues') || 'none');
      },
      warning: 'Should be a public URL.'
    },
    licenses: {
      message: 'Licenses',
      default: 'MIT',
      validator: /^[\w\-\.\d]+(?:\s+[\w\-\.\d]+)*$/,
      warning: 'Must be zero or more space-separated licenses. Built-in ' +
        'licenses are: ' + availableLicenses().join(' ') + ', but you may ' +
        'specify any number of custom licenses.',
      // Split the string on spaces.
      sanitize: function(value, data, done) { done(value.split(/\s+/)); }
    },
    author_name: {
      message: 'Author name',
      default: function(value, data, done) {
        // Attempt to pull the data from the user's git config.
        grunt.util.spawn({
          cmd: 'git',
          args: ['config', '--get', 'user.name'],
          fallback: 'none'
        }, done);
      },
      warning: 'May consist of any characters.'
    },
    author_email: {
      message: 'Author email',
      default: function(value, data, done) {
        // Attempt to pull the data from the user's git config.
        grunt.util.spawn({
          cmd: 'git',
          args: ['config', '--get', 'user.email'],
          fallback: 'none'
        }, done);
      },
      warning: 'Should be a valid email address.'
    },
    author_url: {
      message: 'Author url',
      default: 'none',
      warning: 'Should be a public URL.'
    },
    jquery_version: {
      message: 'Required jQuery version',
      default: '>= 1.6',
      warning: 'Must be a valid semantic version range descriptor.'
    },
    node_version: {
      message: 'What versions of node does it run on?',
      // TODO: pull from grunt's package.json
      default: '>= 0.6.0',
      warning: 'Must be a valid semantic version range descriptor.'
    },
    main: {
      message: 'Main module/entry point',
      default: function(value, data, done) {
        done(null, 'lib/' + data.name);
      },
      warning: 'Must be a path relative to the project root.'
    },
    bin: {
      message: 'CLI script',
      default: function(value, data, done) {
        done(null, 'bin/' + data.name);
      },
      warning: 'Must be a path relative to the project root.'
    },
    npm_test: {
      message: 'Npm test command',
      default: 'grunt',
      warning: 'Must be an executable command.'
    },
    grunt_version: {
      message: 'What versions of grunt does it require?',
      default: '~' + grunt.version,
      warning: 'Must be a valid semantic version range descriptor.'
    }
  });

};

/*
 * grunt
 * http://gruntjs.com/
 *
 * Copyright (c) 2014 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt/blob/master/LICENSE-MIT
 */

'use strict';

var fs = require('fs');
var path = require('path');
var util = require('util');

var grunt = require('../grunt');

// The module to be exported
var lang = module.exports = {};

// The language registry
var registry = {};

// Lookup the specified extension, try to
// load required language plugins `grunt-lang-<name>``
// returns language plugin descriptor
//
// {
//     language : 'CoffeeScript',
//     version  : '1.8.0+',
//     provider : 'grunt-lang-coffee',
//     extensions : [
//        'coffee',
//        'litcoffee'
//     ]
// }
lang.lookupExtension = function(extension) {
    if (typeof registry[extension] === 'undefined') {
        tryLoadPlugins(extension)
    }
    return registry[extension];
}

function tryLoadPlugins(extension) {
    var searchPaths = [].concat(module.paths, process.env.NODE_PATH);
    for (var index = 0; index < searchPaths.length; index++) {
        searchPaths[index] = path.join(searchPaths[index], 'grunt-lang-*');
    }
    
    var seenPackages = [];
    var candidatePackagePaths = grunt.file.expand(searchPaths);
    // now load all candidate packages once, starting with those
    // located nearest to the CWD, e.g. locally installed node_modules
    // and then try loading those installed globally
    for (var index = 0; index < candidatePackagePaths.length; index++) {
        var candidatePackagePath = candidatePackagePaths[index];
        var packageName = path.basename(candidatePackagePath);
        var registerModulePath = path.join(candidatePackagePath, 'register.js');
        if (seenPackages.indexOf(packageName) == -1
            && fs.existsSync(registerModulePath)) {
            grunt.log.writeln(
                'found language plugin: ' + packageName
                + ' in path ' + path.dirname(candidatePackagePath)
            );
            try {
                var register = require(registerModulePath);
                var descriptor = register();
                for (var index2 = 0; index2 < descriptor.extensions.length; index2++) {
                    registry[descriptor.extensions[index2]] = descriptor;
                }
                seenPackages.push(packageName)
            }
            catch (e) {
                grunt.log.warn(
                    'unable to load language support plugin ' + packageName
                    + ' from ' + candidatePackagePath
                    + ' due to ' + e.toString()
                );
            }
        }
    }
}


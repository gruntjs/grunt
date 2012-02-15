/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

module.exports = function(init, done) {
  task.helper('prompt', {type: 'jquery'}, [
    // Prompt for these values.
    task.helper('prompt_for', 'name'),
    task.helper('prompt_for', 'title'),
    task.helper('prompt_for', 'description', 'The best jQuery plugin ever.'),
    task.helper('prompt_for', 'version'),
    task.helper('prompt_for', 'repository'),
    task.helper('prompt_for', 'homepage'),
    task.helper('prompt_for', 'bugs'),
    task.helper('prompt_for', 'licenses'),
    task.helper('prompt_for', 'author_name'),
    task.helper('prompt_for', 'author_email'),
    task.helper('prompt_for', 'author_url')
  ], function(err, props) {
    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process). files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackage('package.json', props);

    // All done!
    done();
  });
};

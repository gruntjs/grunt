module.exports = function(init, done) {
  task.helper('prompt', {}, [
    // Prompt for these values.
    task.helper('prompt_for', 'name'),
    task.helper('prompt_for', 'description'),
    task.helper('prompt_for', 'version'),
    task.helper('prompt_for', 'repository'),
    task.helper('prompt_for', 'homepage'),
    task.helper('prompt_for', 'bugs'),
    task.helper('prompt_for', 'licenses'),
    task.helper('prompt_for', 'author_name'),
    task.helper('prompt_for', 'author_email'),
    task.helper('prompt_for', 'author_url'),
    task.helper('prompt_for', 'node_version'),
    task.helper('prompt_for', 'node_main'),
    task.helper('prompt_for', 'node_test')
  ], function(err, props) {
    // Files to copy (and process).
    var files = [
      {src: 'grunt.js'},
      {src: 'README.md'},
      {src: 'lib/name.js', dest: 'lib/' + props.name + '.js'},
      {src: 'test/name_test.js', dest: 'test/' + props.name + '_test.js'}
    ];
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

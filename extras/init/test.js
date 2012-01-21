module.exports = function(init, done) {
  task.helper('prompt', [
    // Prompt for these values.
    task.helper('property', 'name'),
    task.helper('property', 'description'),
    task.helper('property', 'version'),
    task.helper('property', 'homepage'),
    task.helper('property', 'repository'),
    task.helper('property', 'bugs'),
    task.helper('property', 'licenses'),
    task.helper('property', 'author_name'),
    task.helper('property', 'author_email'),
    task.helper('property', 'author_url'),
    task.helper('property', 'node_version'),
    task.helper('property', 'node_main'),
    task.helper('property', 'node_test')
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

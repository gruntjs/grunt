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
    var files = [
      {src: 'grunt.js'},
      {src: 'README.md'},
      {src: 'src/name.js', dest: 'src/' + props.name + '.js'},
      {src: 'test/name_test.js', dest: 'test/' + props.name + '_test.js'},
      {src: 'test/name.html', dest: 'test/' + props.name + '.html'},
      {src: 'libs/jquery/jquery.js'},
      {src: 'libs/qunit/qunit.js'},
      {src: 'libs/qunit/qunit.css'}
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

module.exports = function(init, done) {
  task.helper('prompt', [
    // Prompt for these values.
    task.helper('property', 'name'),
    task.helper('property', 'description'),
    task.helper('property', 'version'),
    task.helper('property', 'homepage'),
    task.helper('property', 'repo'),
    task.helper('property', 'bugs'),
    task.helper('property', 'author_name'),
    task.helper('property', 'author_email'),
    task.helper('property', 'author_url')
  ], function(err, props) {
    // Copy (and process) files.
    [
      {src: 'grunt.js'},
      {src: 'LICENSE-MIT'},
      {src: 'README.md'},
      {src: 'lib/project.js', dest: 'lib/' + props.name + '.js'},
      {src: 'test/project_test.js', dest: 'test/' + props.name + '_test.js'}
    ].forEach(function(files) {
      init.copy(files.src, files.dest || files.src, function(contents) {
        return underscore.template(contents)(props);
      });
    });
    // All done!
    done();
  });
};

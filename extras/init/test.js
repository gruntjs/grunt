module.exports = function(done) {
  task.helper('prompt', [
    task.helper('property', 'name'),
    task.helper('property', 'description'),
    task.helper('property', 'version'),
    task.helper('property', 'homepage'),
    task.helper('property', 'repo'),
    task.helper('property', 'bugs'),
    task.helper('property', 'author_name'),
    task.helper('property', 'author_email'),
    task.helper('property', 'author_url')
  ], function(err, properties) {
    log.subhead('Properties:');
    console.log(properties);
    done();
  });
};

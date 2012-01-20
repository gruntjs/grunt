var path = require('path');

module.exports = function(done) {
  var properties = [
    task.helper('property', 'name'),
    task.helper('property', 'description'),
    task.helper('property', 'version'),
    task.helper('property', 'homepage'),
    task.helper('property', 'repo'),
    task.helper('property', 'bugs'),
    task.helper('property', 'author_name'),
    task.helper('property', 'author_email'),
    task.helper('property', 'author_url')
  ];

  task.helper('prompt', properties, function(err, properties) {
    console.log(properties);
    done();
  });
};

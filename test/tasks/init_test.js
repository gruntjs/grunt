exports['github_web_url'] = {
  'no args': function(test) {
    test.expect(1);
    test.equal(task.helper('github_web_url'), null, 'It should return null.');
    test.done();
  },
  'nonsensical args': function(test) {
    test.expect(3);
    test.equal(task.helper('github_web_url', ''), null, 'It should return null.');
    test.equal(task.helper('github_web_url', 'omgfoo'), null, 'It should return null.');
    test.equal(task.helper('github_web_url', 'http://benalman.com/'), null, 'It should return null.');
    test.done();
  },
  'no suffix': function(test) {
    test.expect(5);
    test.equal(task.helper('github_web_url', 'git@github.com:cowboy/grunt.git'), 'https://github.com/cowboy/grunt', 'It should convert the URI.');
    test.equal(task.helper('github_web_url', 'https://cowboy@github.com/cowboy/grunt.git'), 'https://github.com/cowboy/grunt', 'It should convert the URI.');
    test.equal(task.helper('github_web_url', 'git://github.com/cowboy/grunt.git'), 'https://github.com/cowboy/grunt', 'It should convert the URI.');
    test.equal(task.helper('github_web_url', 'http://github.com/paulirish/newsite'), 'https://github.com/paulirish/newsite', 'It should convert the URI.');
    test.equal(task.helper('github_web_url', 'http://github.com/paulirish/newsite/'), 'https://github.com/paulirish/newsite', 'It should convert the URI.');
    test.done();
  },
  'suffix': function(test) {
    test.expect(7);
    test.equal(task.helper('github_web_url', 'git@github.com:cowboy/grunt.git', 'issues'), 'https://github.com/cowboy/grunt/issues', 'It should convert the URI.');
    test.equal(task.helper('github_web_url', 'https://cowboy@github.com/cowboy/grunt.git', 'issues'), 'https://github.com/cowboy/grunt/issues', 'It should convert the URI.');
    test.equal(task.helper('github_web_url', 'git://github.com/cowboy/grunt.git', 'issues'), 'https://github.com/cowboy/grunt/issues', 'It should convert the URI.');
    test.equal(task.helper('github_web_url', 'http://github.com/paulirish/newsite', 'issues'), 'https://github.com/paulirish/newsite/issues', 'It should convert the URI.');
    test.equal(task.helper('github_web_url', 'http://github.com/paulirish/newsite/', 'issues'), 'https://github.com/paulirish/newsite/issues', 'It should convert the URI.');
    test.equal(task.helper('github_web_url', 'http://github.com/paulirish/newsite', '/issues'), 'https://github.com/paulirish/newsite/issues', 'It should convert the URI.');
    test.equal(task.helper('github_web_url', 'http://github.com/paulirish/newsite/', '/issues'), 'https://github.com/paulirish/newsite/issues', 'It should convert the URI.');
    test.done();
  }
};


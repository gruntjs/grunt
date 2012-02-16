exports['config'] = function(test) {
  test.expect(2);
  test.deepEqual(task.helper('config'), config(), 'It should just pass through to config.');
  test.deepEqual(task.helper('config', 'meta'), config('meta'), 'It should just pass through to config.');
  test.done();
};

exports['json'] = function(test) {
  test.expect(2);
  var obj = task.helper('json', 'test/fixtures/test.json');
  test.equal(obj.foo, 'bar', 'JSON properties should be available as-defined.');
  test.deepEqual(obj.baz, [1, 2, 3], 'JSON properties should be available as-defined.');
  test.done();
};

exports['child_process'] = function(test) {
  // nothing yet
  test.done();
};

exports['strip_banner'] = function(test) {
  test.expect(2);
  var src = file.read('test/fixtures/banner.js');
  test.equal(task.helper('strip_banner', src), '// Comment\n\n/* Comment */\n', 'It should strip only the top banner.');
  src = file.read('test/fixtures/banner2.js');
  test.equal(task.helper('strip_banner', src), '\n/*! SAMPLE\n * BANNER */\n\n// Comment\n\n/* Comment */\n', 'It should strip only the top banner.');
  test.done();
};

exports['file_strip_banner'] = function(test) {
  test.expect(2);
  var filepath = 'test/fixtures/banner.js';
  test.equal(task.helper('file_strip_banner', filepath), '// Comment\n\n/* Comment */\n', 'It should strip only the top banner.');
  filepath = 'test/fixtures/banner2.js';
  test.equal(task.helper('file_strip_banner', filepath), '\n/*! SAMPLE\n * BANNER */\n\n// Comment\n\n/* Comment */\n', 'It should not strip a top banner beginning with /*!.');
  test.done();
};

exports['banner'] = function(test) {
  test.expect(5);
  config('test_config', {a: 'aaaaa', b: 'bbbbb', c: [1, 2, 3], d: [{a: 1}, {a: 2}, {a: 3}]});

  config('meta.banner', 'foo\n<%= test_config.a %>\nbar');
  test.equal(task.helper('banner'), util.normalizelf('foo\naaaaa\nbar\n'), 'It should use the default banner.');

  config('test_config.banner', '<%= test_config.b %>');
  test.equal(task.helper('banner', 'test_config.banner'), util.normalizelf('bbbbb\n'), 'It should use the requested banner.');

  config('test_config.banner', '<%= test_config.c.join(", ") %>');
  test.equal(task.helper('banner', 'test_config.banner'), util.normalizelf('1, 2, 3\n'), 'It should join arrays.');

  config('test_config.banner', '<%= _.pluck(test_config.d, "a").join(", ") %>');
  test.equal(task.helper('banner', 'test_config.banner'), util.normalizelf('1, 2, 3\n'), 'It should join arrays.');

  config('test_config.banner', '<%= template.today("m/d/yyyy") %>');
  test.equal(task.helper('banner', 'test_config.banner'), util.normalizelf(template.today('m/d/yyyy') + '\n'), 'It should parse the current date correctly.');

  test.done();
};

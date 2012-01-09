var dateformat = require('dateformat');

exports['config'] = function(test) {
  test.expect(2);
  test.deepEqual(task.helper('config'), config(), 'It should just pass through to config.');
  test.deepEqual(task.helper('config', 'meta'), config('meta'), 'It should just pass through to config.');
  test.done();
};

exports['strip_banner'] = function(test) {
  test.expect(1);
  var src = file.read('test/fixtures/banner.js');
  test.equal(task.helper('strip_banner', src), '// Comment\n\n/* Comment */\n', 'It should strip only the top banner.');
  test.done();
};

exports['file_strip_banner'] = function(test) {
  test.expect(1);
  var filepath = 'test/fixtures/banner.js';
  test.equal(task.helper('file_strip_banner', filepath), '// Comment\n\n/* Comment */\n', 'It should strip only the top banner.');
  test.done();
};

exports['banner'] = function(test) {
  test.expect(5);
  config('test_config', {a: 'aaaaa', b: 'bbbbb', c: [1, 2, 3]});

  config('meta.banner', 'foo\n{{test_config.a}}\nbar');
  test.equal(task.helper('banner'), 'foo\naaaaa\nbar\n', 'It should use the default banner.');

  config('test_config.banner', '{{test_config.b}}');
  test.equal(task.helper('banner', 'test_config.banner'), 'bbbbb\n', 'It should use the requested banner.');

  config('test_config.banner', '{{join test_config.c}}');
  test.equal(task.helper('banner', 'test_config.banner'), '1, 2, 3\n', 'It should join arrays with comma+space by default.');

  config('test_config.banner', '{{join test_config.c " + "}}');
  test.equal(task.helper('banner', 'test_config.banner'), '1 + 2 + 3\n', 'It should join arrays with a custom delimiter.');

  config('test_config.banner', '{{today "m/d/yyyy"}}');
  test.equal(task.helper('banner', 'test_config.banner'), dateformat(new Date(), 'm/d/yyyy') + '\n', 'It should parse the current date correctly.');

  test.done();
};

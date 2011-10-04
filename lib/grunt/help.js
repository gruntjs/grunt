var optlist = grequire('cli').optlist;

task.init(true);

var col1len = 0;

var opts = Object.keys(optlist).map(function(long) {
  var o = optlist[long];
  var col1 = '--' + long + (o.short ? ', -' + o.short : '');
  col1len = Math.max(col1len, col1.length);
  return [col1, o.info];
});

var tasks = Object.keys(task.infos).map(function(name) {
  col1len = Math.max(col1len, name.length);
  return [name, task.infos[name]];
});

// opts.push(['foo', 'aaa bbb ccc ddd eee'])
// opts.push(['foo', 'aaa bbb ccc ddd eee fff ggg hhh iii jjj kkk lll mmm nnn ooo ppp qqq rrr sss ttt']);
// opts.push(['foo', 'a b c d e f g h i j k l m n o p q r s t u v w x y z']);
// opts.push(['foo', 'a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z']);
// opts.push(['foo', 'aa b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k l m n o p q r s t u v w x y z']);
// opts.push(['foo', 'aaaaaaaa bbbbbbbb cccccccc dddddddd eeeeeeee ffffffff gggggggg hhhhhhhh']);
// opts.push(['foo', 'aaaaaaaa bbbbbbbb cccccccc dddddddd eeeeeeee ffffffff gggggggg hhhhhhhh iiiiiiii']);

// Adjust to allow for spacing.
col1len += 2;

// Match as many characters as possible until a set numeric limit has been
// reached, avoiding splitting words whenever possible.
var re = new RegExp('.{1,' + (80 - col1len - 1) + '}(?=\\s|$)', 'g');

// Actually write output, padding and wrapping as necessary..
function writeln(arr) {
  var col1 = arr[0];
  var col2 = arr[1].replace(re, function(s) {
    return '\n' + repeat(col1len + 1) + s.replace(/^\s+/, '');
  }).replace(/^\s+/, '');
  log.writeln(' ' + col1 + repeat(col1len - col1.length) + col2);
}

// Get a string `str` repeated `n` times.
function repeat(n, str) {
  return Array(n + 1).join(str || ' ');
}

log.writeln('grunt: a command line build tool for JavaScript projects.\n');

// Actually write out help screen.
log.header('Options');
opts.forEach(writeln);

log.header('\nTasks');
tasks.forEach(writeln);

process.exit();

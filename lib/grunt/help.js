var optlist = grequire('cli').optlist;

console.log('Options:');
Object.keys(optlist).forEach(function(long) {
  var o = optlist[long];
  console.log(' --' + long + ', -' + o.short + '  ' + o.info);
});

var tasks = grequire('task').tasks;

console.log('\nTasks:');
Object.keys(tasks).forEach(function(task) {
  var o = tasks[task];
  console.log(' ' + task + '  ' + o.info);
});

process.exit();


var code = Number(process.argv[2]);

process.stdout.write('stdout\n');
process.stderr.write('stderr\n');

process.exit(code);

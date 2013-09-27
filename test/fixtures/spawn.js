
var code = Number(process.argv[2]);

process.stdout.write('stdout\n');
process.stderr.write('stderr\n');

// Use instead of process.exit to ensure stdout/stderr are flushed
// before exiting in Windows (Tested in Node.js v0.8.7)
function exit(exitCode) {
  if (process.stdout._pendingWriteReqs || process.stderr._pendingWriteReqs) {
    process.nextTick(function() {
      exit(exitCode);
    });
  } else {
    process.exit(exitCode);
  }
}

exit(code);

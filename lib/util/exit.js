// Waits for the stream to have fully received its content.
var waitForStreamEnd = function (stream, callback) {
    // Writes an empty string to check the state of the buffer:
    if (!stream.write("")) {
        stream.once('drain', callback);
    } else {
        callback();
    }
};

// Exits the process asynchronously, making sure the stdout and stderr streams have fully received their content.
var exitProcess = function (exitCode) {
    var ok = 0;
    var increaseOk = function () {
        ok++;
        if (ok == 3) {
            process.exit(exitCode);
        }
    };
    waitForStreamEnd(process.stdout, increaseOk);
    waitForStreamEnd(process.stderr, increaseOk);
    process.nextTick(increaseOk);
};

module.exports = exitProcess;
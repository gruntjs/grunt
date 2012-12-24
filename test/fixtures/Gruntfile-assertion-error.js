var assert = require('assert');
module.exports = function(grunt) {
    grunt.initConfig({
        assertFail: {
            bad: {},
            ok: {
                options: {
                    ignoreAssertions: true
                }
            },
        },
    });

    grunt.registerMultiTask('assertFail', 'Causes an assertion failure', function() {
        var done = this.async();
        setTimeout(function() {
            assert(false, 'tddplz');
            done();
        }, 0);
    });
};

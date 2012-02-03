[Grunt homepage](https://github.com/cowboy/grunt)

# Grunt exit codes

* `1` - Generic error.
* `2` - Config file not found.
* `3` - Generic task failed.
* `10` - Uglify-JS error.
* `11` - Banner generation error.
* `20` - Init error.
* `90-99` - Nodeunit/QUnit errors.

## Nodeunit/QUnit specific

* `90` - Non-assertion-specific error, like a timeout or JavaScript error.
* `91-99` - 91 = 1 assertion failed, 95 = 5 assertions failed, 99 = 9 or more assertions failed (you get the idea).

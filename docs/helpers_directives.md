[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# Helpers and Directives

## Built-in Helpers
EXPLAIN

Take a look at the [built-in tasks source code](../tasks) for more examples.

## Built-in Directives

### `<config:prop.subprop>`
Expands to the value of the `prop.subprop` config property. This can be any number of objects deep, `prop.subprop.otherprop.whatever` is totally valid. Great for DRYing up file lists.

### `<config_process:prop.subprop>`
Like the `<config>` directive, but recursively processes `<% %>` templates as well. This directive is just a wrapper around the [grunt.config.process](api_config.md#gruntconfigprocess) method.

Take a look at the [api documentation](api.md) and [example Gruntfiles](example_gruntfiles.md) for directive creation and usage examples.

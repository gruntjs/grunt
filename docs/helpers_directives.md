[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# Helpers and Directives

## Built-in Helpers <a name="built-in-helpers" href="#built-in-helpers" title="Link to this section">#</a>
EXPLAIN

Take a look at the [built-in tasks source code](../tasks) for more examples.

## Built-in Directives <a name="built-in-directives" href="#built-in-directives" title="Link to this section">#</a>

### `<config:prop.subprop>` <a name="config-prop-subprop" href="#config-prop-subprop" title="Link to this section">#</a>
Expands to the value of the `prop.subprop` config property. This can be any number of objects deep, `prop.subprop.otherprop.whatever` is totally valid. Great for DRYing up file lists.

### `<json:file.json>` <a name="json-file-json" href="#json-file-json" title="Link to this section">#</a>
Expand to the object parsed from file.json via [grunt.file.parseJSON](api_file.md).

### `<banner:prop.subprop>` <a name="banner-prop-subprop" href="#banner-prop-subprop" title="Link to this section">#</a>
Expand to the string in config property `prop.subprop`, parsed via [grunt.template.process](api_template.md), using `<% %>` delimiters. If the config property isn't specified like `<banner>`, defaults to the `meta.banner` property.

### `<file_strip_banner:file.js>` <a name="file-strip-banner-file-js" href="#file-strip-banner-file-js" title="Link to this section">#</a>
Expand to the given file, with any leading `/*...*/` banner (excluding `/*!...*/` comments) stripped. Flags can be passed to instruct which banners to strip. The `line` flag (eg. `<file_strip_banner:file.js:line>`) will remove a continguous block of leading `//` line comments, while the `block` flag (eg. `<file_strip_banner:file.js:block>`) will strip _all_ block comments.

### `<file_template:file.js>` <a name="file-template-file-js" href="#file-template-file-js" title="Link to this section">#</a>
Expand to the given file, parsed as a template via [grunt.template.process](api_template.md), using `<% %>` delimiters.

Take a look at the [api documentation](api.md) and [example Gruntfiles](example_gruntfiles.md) for directive creation and usage examples.

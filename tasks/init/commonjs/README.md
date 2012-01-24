# {%= name %}

{%= description %}

## Getting Started
Install the module with: `npm install {%= name %}`

```javascript
var {%= js_safe_name %} = require('{%= name %}');
{%= js_safe_name %}.awesome(); // "awesome"
```

Or in the browser:

```html
<script src="dist/{%= js_safe_name %}.min.js"></script>
<script>
awesome(); // "awesome"
</script>
```

In the browser, you can attach {%= name %}'s methods to any object.

```html
<script>
this.exports = Bocoup.utils;
</script>
<script src="dist/{%= js_safe_name %}.min.js"></script>
<script>
Bocoup.utils.awesome(); // "awesome"
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) {%= template.today('yyyy') %} {%= author_name %}  
Licensed under the {%= licenses.join(', ') %} license{%= licenses.length === 1 ? '' : 's' %}.

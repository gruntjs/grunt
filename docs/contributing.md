# grunt

## Contributing to grunt

If you want to make contributions to grunt, by all means, please do so. "Patches welcome."

### Discussing grunt

Join the [freenode](http://freenode.net/) #grunt IRC channel. We've got a bot and everything.

### Cloning grunt

Ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

Fork grunt in GitHub, and clone it locally:

```bash
git clone git://github.com/YOURUSERNAME/grunt.git && cd grunt
```

To download grunt dependencies and add the development `grunt` script to your path:

```bash
npm install && npm link
```

### Reverting back to production grunt

If, for some reason, you need to revert back to the official grunt release, this will ensure that the `grunt` script links to the globally installed production release:

```bash
npm install -g grunt
```

### Actually contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Fork, tweak, and make pull requests.. but `grunt` grunt first:

```bash
grunt
```

_(you shouldn't see any red when you do this)_

[Grunt homepage](http://gruntjs.com/) | [Documentation table of contents](toc.md)

# Contributing to grunt

If you want to make contributions to grunt, by all means, please do so. "Patches welcome."

## Discussing grunt <a name="discussing-grunt" href="#discussing-grunt" title="Link to this section">#</a>

Join the [freenode](http://freenode.net/) #grunt IRC channel. We've got a bot and everything.

## Filing issues <a name="filing-issues" href="#filing-issues" title="Link to this section">#</a>

If something isn't working like you think it should, read the [API documentation](api.md). If it still isn't working like you think it should, [file an issue](https://github.com/cowboy/grunt/issues). If you'd like to chat directly, pop into IRC.

## Cloning grunt <a name="cloning-grunt" href="#cloning-grunt" title="Link to this section">#</a>

first, ensure that you have the latest [Node.js](http://nodejs.org/) and [npm](http://npmjs.org/) installed.

Fork grunt in GitHub, and clone it locally:

```bash
git clone git://github.com/YOURUSERNAME/grunt.git && cd grunt
```

To download grunt dependencies and add the development `grunt` bin script to your path:

```bash
npm install && npm link
```

## Reverting back to the "live" grunt <a name="reverting-back-to-the-live-grunt" href="#reverting-back-to-the-live-grunt" title="Link to this section">#</a>

If, for some reason, you need to revert back to the current npm grunt release, just reinstall grunt globally via:

```bash
npm install -g grunt
```

## Actually contributing <a name="actually-contributing" href="#actually-contributing" title="Link to this section">#</a>

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Fork, tweak, and make pull requests.. but `grunt` grunt first:

```bash
grunt
```

_(you shouldn't see any red or yellow when you do this)_

## One final note about contributing <a name="one-final-note-about-contributing" href="#one-final-note-about-contributing" title="Link to this section">#</a>

I'll be completely up-front: while you know that your idea is well-reasoned and executed, I might need to be convinced of the value of incorporating it into grunt, because it might not be immediately apparent to me. Don't lose hope! All I ask is that you include, along with your pull request, an explanation of how your code is going to improve grunt. Thanks!

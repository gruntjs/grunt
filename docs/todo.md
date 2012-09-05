# Misc todos

Test `--no-color` color-stripping with something like this:

```js
grunt.registerTask('color', function() {
  console.log({a: 1, b: 2});
  console.log([{a: 1, b: 2}, {c: 3, d: 4}]);
  console.log('foo'.green + ' ' + 'bar'.red);
  console.log('foo'.green, 'bar'.red);
  grunt.log.write('foo'.green + ' ' + 'bar'.red + '...').ok();
  console.log('\u001b[32mfoo\u001b[0m \u001b[31mbar');
  grunt.log.write('\u001b[32mfoo\u001b[0m \u001b[31mbar\u001b[0m...').ok();
});
```

/*global $:true */
/*global QUnit:true, module:true, test:true, asyncTest:true, expect:true,
  ok:true, equal:true, notEqual:true, deepEqual:true, notDeepEqual:true,
  strictEqual:true, notStrictEqual:true, raises:true, start:true, stop:true */

test('test_name', 1, function() {
  var fix = $('#qunit-fixture');
  deepEqual(fix.awesome().get(), fix.get(), 'method should be chainable');
});

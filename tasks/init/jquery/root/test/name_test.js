/*global QUnit:true, module:true, test:true, asyncTest:true, expect:true*/
/*global start:true, stop:true ok:true, equal:true, notEqual:true, deepEqual:true*/
/*global notDeepEqual:true, strictEqual:true, notStrictEqual:true, raises:true*/
(function($) {

  module('jQuery#awesome', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is chainable', 1, function() {
    // Not a bad test to run on collection methods.
    strictEqual(this.elems.awesome(), this.elems, 'should be chaninable');
  });

  test('is awesome', 1, function() {
    strictEqual(this.elems.awesome().text(), 'awesomeawesomeawesome', 'should be thoroughly awesome');
  });

  module('jQuery.awesome');

  test('is awesome', 1, function() {
    strictEqual($.awesome(), 'awesome', 'should be thoroughly awesome');
  });

  module(':awesome selector', {
    setup: function() {
      this.elems = $('#qunit-fixture').children();
    }
  });

  test('is awesome', 1, function() {
    // Use deepEqual & .get() when comparing jQuery objects.
    deepEqual(this.elems.filter(':awesome').get(), this.elems.last().get(), 'knows awesome when it sees it');
  });

}(jQuery));

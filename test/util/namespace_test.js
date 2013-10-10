'use strict';

var namespace = require('../../lib/util/namespace.js');

exports.get = {
  'no create': function(test) {
    var obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};
    test.strictEqual(namespace.get(obj, 'a'), obj.a, 'should get immediate properties.');
    test.strictEqual(namespace.get(obj, 'a.b'), obj.a.b, 'should get nested properties.');
    test.strictEqual(namespace.get(obj, 'a.x'), undefined, 'should return undefined for nonexistent properties.');
    test.strictEqual(namespace.get(obj, 'a.b.c'), 1, 'should return values.');
    test.strictEqual(namespace.get(obj, 'a.b.d'), '', 'should return values.');
    test.strictEqual(namespace.get(obj, 'a.b.e'), null, 'should return values.');
    test.strictEqual(namespace.get(obj, 'a.b.f'), undefined, 'should return values.');
    test.strictEqual(namespace.get(obj, 'a.b.g\\.h\\.i'), 2, 'literal backslash should escape period in property name.');
    test.done();
  },
  'create': function(test) {
    var obj = {a: 1};
    test.strictEqual(namespace.get(obj, 'a', true), obj.a, 'should just return existing properties.');
    test.strictEqual(namespace.get(obj, 'b', true), obj.b, 'should create immediate properties.');
    test.strictEqual(namespace.get(obj, 'c.d.e', true), obj.c.d.e, 'should create nested properties.');
    test.done();
  }
};

exports.get_fn = {
  'no create': function(test) {
    var fn = function () {};
    fn.a = {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}};
    test.strictEqual(namespace.get(fn, 'a'), fn.a, 'should get immediate properties.');
    test.strictEqual(namespace.get(fn, 'a.b'), fn.a.b, 'should get nested properties.');
    test.strictEqual(namespace.get(fn, 'a.x'), undefined, 'should return undefined for nonexistent properties.');
    test.strictEqual(namespace.get(fn, 'a.b.c'), 1, 'should return values.');
    test.strictEqual(namespace.get(fn, 'a.b.d'), '', 'should return values.');
    test.strictEqual(namespace.get(fn, 'a.b.e'), null, 'should return values.');
    test.strictEqual(namespace.get(fn, 'a.b.f'), undefined, 'should return values.');
    test.done();
  },
  'create': function(test) {
    var obj = function () {};
    obj.a = 1;
    test.strictEqual(namespace.get(obj, 'a', true), obj.a, 'should just return existing properties.');
    test.strictEqual(namespace.get(obj, 'b', true), obj.b, 'should create immediate properties.');
    test.strictEqual(namespace.get(obj, 'c.d.e', true), obj.c.d.e, 'should create nested properties.');
    test.done();
  }
};

exports.set = function(test) {
  var obj = {};
  test.strictEqual(namespace.set(obj, 'a', 1), 1, 'should return immediate property value.');
  test.strictEqual(obj.a, 1, 'should set property value.');
  test.strictEqual(namespace.set(obj, 'b.c.d', 1), 1, 'should return nested property value.');
  test.strictEqual(obj.b.c.d, 1, 'should set property value.');
  test.strictEqual(namespace.set(obj, 'e\\.f\\.g', 1), 1, 'literal backslash should escape period in property name.');
  test.strictEqual(obj['e.f.g'], 1, 'should set property value.');
  test.done();
};

exports.set_fn = function(test) {
  var fn = function () {};
  fn.a = 1;
  test.strictEqual(namespace.set(fn, 'a', 1), 1, 'should return immediate property value.');
  test.strictEqual(fn.a, 1, 'should set property value.');
  test.strictEqual(namespace.set(fn, 'b.c.d', 1), 1, 'should return nested property value.');
  test.strictEqual(fn.b.c.d, 1, 'should set property value.');
  test.strictEqual(namespace.set(fn, 'e\\.f\\.g', 1), 1, 'literal backslash should escape period in property name.');
  test.strictEqual(fn['e.f.g'], 1, 'should set property value.');
  test.done();
};

exports.exists = function(test) {
  var obj = {a: {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}}};
  test.ok(namespace.exists(obj, 'a'), 'immediate property should exist.');
  test.ok(namespace.exists(obj, 'a.b'), 'nested property should exist.');
  test.ok(namespace.exists(obj, 'a.b.c'), 'nested property should exist.');
  test.ok(namespace.exists(obj, 'a.b.d'), 'nested property should exist.');
  test.ok(namespace.exists(obj, 'a.b.e'), 'nested property should exist.');
  test.ok(namespace.exists(obj, 'a.b.f'), 'nested property should exist.');
  test.ok(namespace.exists(obj, 'a.b.g\\.h\\.i'), 'literal backslash should escape period in property name.');
  test.equal(namespace.exists(obj, 'x'), false, 'nonexistent property should not exist.');
  test.equal(namespace.exists(obj, 'a.x'), false, 'nonexistent property should not exist.');
  test.equal(namespace.exists(obj, 'a.b.x'), false, 'nonexistent property should not exist.');
  test.done();
};

exports.exists_fn = function(test) {
  var fn = function () {};
  fn.a = {b: {c: 1, d: '', e: null, f: undefined, 'g.h.i': 2}};
  test.ok(namespace.exists(fn, 'a'), 'immediate property should exist.');
  test.ok(namespace.exists(fn, 'a.b'), 'nested property should exist.');
  test.ok(namespace.exists(fn, 'a.b.c'), 'nested property should exist.');
  test.ok(namespace.exists(fn, 'a.b.d'), 'nested property should exist.');
  test.ok(namespace.exists(fn, 'a.b.e'), 'nested property should exist.');
  test.ok(namespace.exists(fn, 'a.b.f'), 'nested property should exist.');
  test.ok(namespace.exists(fn, 'a.b.g\\.h\\.i'), 'literal backslash should escape period in property name.');
  test.equal(namespace.exists(fn, 'x'), false, 'nonexistent property should not exist.');
  test.equal(namespace.exists(fn, 'a.x'), false, 'nonexistent property should not exist.');
  test.equal(namespace.exists(fn, 'a.b.x'), false, 'nonexistent property should not exist.');
  test.done();
};

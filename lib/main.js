'use strict';

var assertions = require('./assertions');
var Sentinel = require('./Sentinel');

// # main
// Exports a Chai plugin to add
// [sentinel-specific assertions](./assertions.js.html).

// ## Usage
// ```js
// chai.use(require('chai-sentinels'));
// ```
exports = module.exports = function(chai) {
  chai.use(assertions);
};

// ## Sentinel
// Constructor for a unique sentinel value.
// [Read more](./sentinels.js.html).
exports.Sentinel = Sentinel;

// ## Static sentinels
// Thirteen different sentinels are available from `chai-sentinels`:
// * `.foo`
// * `.bar`
// * `.baz`
// * `.qux`
// * `.quux`
// * `.corge`
// * `.grault`
// * `.garply`
// * `.waldo`
// * `.fred`
// * `.plugh`
// * `.xyzzy`
// * `.thud`
var FIELDS = [
  'foo', 'bar', 'baz', 'qux', 'quux', 'corge', 'grault', 'garply', 'waldo',
  'fred', 'plugh', 'xyzzy', 'thud'
];

FIELDS.forEach(function(name) {
  exports[name] = new Sentinel(name);
});

// ## stubObject(length)
// Creates an object with new sentinel instances. Provide `length` (at least 1,
// max 13) to control how many sentinels the object will contain. Property
// names are picked from the standard list of metasyntactic variables, in order.
// see [RFC 3092](http://tools.ietf.org/html/rfc3092). The sentinel label is
// set to the same name.

// `length` defaults to `3` if it's passed as `0` or cannot be cast to a number.
// Throws a `TypeError` if `length` is outside the allowed range.
exports.stubObject = function(length) {
  length = Number(length) || 3;
  if (length < 1 || length > FIELDS.length) {
    throw new TypeError('Expected 1 <= `length` <= ' + FIELDS.length);
  }

  return FIELDS.slice(0, length).reduce(function(obj, name) {
    obj[name] = new Sentinel(name);
    return obj;
  }, {});
};

// ## stubArray(length)
// Creates an array with new sentinel instances. Provide `length` (at least 1,
// max 13) to control how many sentinels the array will contain. Sentinel labels
// are picked from the standard list of metasyntactic variables, in order.
// see [RFC 3092](http://tools.ietf.org/html/rfc3092).

// `length` defaults to `3` if it's passed as `0` or cannot be cast to a number.
// Throws a `TypeError` if `length` is outside the allowed range.
exports.stubArray = function(length) {
  length = Number(length) || 3;
  if (length < 1 || length > FIELDS.length) {
    throw new TypeError('Expected 1 <= `length` <= ' + FIELDS.length);
  }

  return FIELDS.slice(0, length).map(Sentinel.unary);
};

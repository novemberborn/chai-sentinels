'use strict';

var Sentinel = require('./Sentinel');

// # Assertions

module.exports = function(chai, utils) {
  var Assertion = chai.Assertion;
  var assert = chai.assert;

  var EXPECTED_MSG = 'validating expected value';

  function assertSentinelEquality(parentAssertion, expected) {
    var equal = new Assertion(parentAssertion._obj);
    utils.transferFlags(parentAssertion, equal, false);
    return equal.to.be.equal(expected);
  }

  var hop = {}.hasOwnProperty;
  function assertArrayEquality(actual, expected) {
    var ok = true;
    for (var i = 0; ok && i < actual.length; i++) {
      if (!hop.call(actual, i)) {
        ok = !hop.call(expected, i);
      } else if (new Assertion(actual[i]).to.be.a.sentinel) {
        ok = expected[i] === actual[i];
      }
    }
    return ok;
  }

  // ## Expect / Should
  // ### .to.be.a.sentinel / .to.not.be.a.sentinel
  // Checks whether the actual value is (or isn't) an instance of `Sentinel`.
  Assertion.addProperty('sentinel', function() {
    this.assert(
      this._obj instanceof Sentinel,
      'expected #{this} to be a Sentinel',
      'expected #{this} to not be a Sentinel'
    );
  });

  // ### .to.be.matchingSentinels(expected)
  // Checks whether the actual value matches the expected sentinels. Behavior
  // varies depending on whether `expected` is a Sentinel, an array or an
  // object.

  // If `expected` is itself a `Sentinel` instance, the actual value must also
  // be a Sentinel instance, and be strictly equal to `expected`.

  // If `expected` is an array, each item must be a `Sentinel` instance. The
  // actual value must also be an array and again each item must be a `Sentinel`
  // instance. Both arrays must have the same length and must not be empty. Only
  // if both arrays contain strictly the same sentinels at the same indexes
  // does the assertion pass.

  // If `expected` is a sparse array, the actual value may also be a sparse
  // array, provided the sparse indexes line up.

  // If `expected` is not an array but is an object, each own-value must be a
  // `Sentinel` instance. The actual value must also be an object and again each
  // own-value must be a `Sentinel` instance. Both objects must have the same
  // own-properties, with at least 1 property each. Only if both objects contain
  // strictly the same sentinels for the same own-properties does the assertion
  // pass.

  // ### .to.not.be.matchingSentinels(expected)
  // Like `.to.be.matchingSentinels(expected)`, but the negation is only applied
  // to the sentinel comparisons.

  // The assertion passes if both `expected` and the actual value are different
  // `Sentinel` instances

  // The assertion passes if both `expected` and the actual value are non-empty
  // arrays containing the same number of `Sentinel` instances, but at least one
  // sentinel does not strictly equal the sentinel at the corresponding index.

  // The assertion passes if both `expected` and the actual value are objects
  // with the same own-properties (at least 1 property each), all containing
  // `Sentinel` instances, and at least one sentinel does not strictly equal the
  // sentinel at the corresponding property.
  Assertion.addMethod('matchingSentinels', function(expected) {
    var matchSingle = expected instanceof Sentinel;
    var matchArray = Array.isArray(expected);
    var matchObject = !matchSingle && !matchArray && expected &&
      typeof expected === 'object';

    var expectedKeys, valueKeys;

    matchArray = matchArray && (
      new Assertion(expected, EXPECTED_MSG).to.not.be.empty,
      //If `expected` is a sparse array, don't check the holes. We'll assert
      //the actual value has holes in the same places.
      expected.forEach(function(e, i) {
        var msg = EXPECTED_MSG + ' at index ' + i;
        return new Assertion(e, msg).to.be.a.sentinel;
      }),
      true
    );

    matchObject = matchObject && (
      new Assertion(expected, EXPECTED_MSG).to.not.be.empty,
      (expectedKeys = Object.keys(expected)).forEach(function(key) {
        var msg = EXPECTED_MSG + ' of key \'' + key + '\'';
        return new Assertion(expected[key], msg).to.be.a.sentinel;
      }),
      true
    );

    if (matchSingle) {
      return new Assertion(this._obj).to.be.a.sentinel,
        assertSentinelEquality(this, expected);
    }

    if (matchArray) {
      return new Assertion(this._obj).to.be.an('array'),
        new Assertion(this._obj).to.not.be.empty,
        new Assertion(this._obj).to.have.length(expected.length),
        this.assert(
          assertArrayEquality(this._obj, expected),
          'expected all sentinels of #{this} to equal #{exp}',
          'expected some sentinels of #{this} to not equal #{exp}',
          expected
        );
    }

    if (matchObject) {
      return new Assertion(this._obj).to.be.an('object'),
        new Assertion(this._obj).to.not.be.empty,
        (valueKeys = Object.keys(this._obj)),
        new Assertion(valueKeys.sort()).to.deep.equal(expectedKeys.sort()),
        this.assert(
          valueKeys.every(function(key) {
            var s = this._obj[key];
            return new Assertion(s).to.be.a.sentinel,
              expected[key] === s;
          }, this),
          'expected all sentinels of #{this} to equal #{exp}',
          'expected some sentinels of #{this} to not equal #{exp}',
          expected
        );
    }

    return new Assertion(expected, EXPECTED_MSG).to.be.a.sentinel;
  });

  // ## Assert
  // ### isSentinel(val, message)
  // See `expect(val, message).to.be.a.sentinel`.
  assert.isSentinel = function(val, message) {
    return new Assertion(val, message).to.be.a.sentinel;
  };

  // ### isNotSentinel(val, message)
  // See `expect(val, message).to.not.be.a.sentinel`.
  assert.isNotSentinel = function(val, message) {
    return new Assertion(val, message).to.not.be.a.sentinel;
  };

  // ### matchingSentinels(actual, expected, message)
  // See `expect(actual, message).to.be.matchingSentinels(expected)`.
  assert.matchingSentinels = function(actual, expected, message) {
    return new Assertion(actual, message).to.be.matchingSentinels(expected);
  };

  // ### nonMatchingSentinels(actual, expected, message)
  // See `expect(actual, message).to.not.be.matchingSentinels(expected)`.
  assert.nonMatchingSentinels = function(actual, expected, message) {
    return new Assertion(actual, message).to.not.be.matchingSentinels(expected);
  };
};

'use strict';

global.shouldPass = function(description, test) {
  it(description + ' should pass', test);
};

global.shouldFail = function(description, test, matchMessage) {
  it(description + ' should fail', function() {
    try {
      test();
      throw new Error(
        'Expected test to fail with an AssertionError, but it passed.');
    } catch (error) {
      if (
        Object(error) !== error ||
        error.constructor.name !== 'AssertionError'
      ) {
        throw new Error(
          'Expected test to fail with an AssertionError, but it threw ' +
          error);
      } else if (
        typeof matchMessage === 'string' &&
        error.message.indexOf(matchMessage) === -1
      ) {
        throw new Error(
          'Expected test to fail with an AssertionError containing "' +
          matchMessage + '" but it was rejected with ' + error);
      } else if (
        matchMessage instanceof RegExp &&
        !matchMessage.test(error.message)
      ) {
        throw new Error(
          'Expected test to fail with an AssertionError matching "' +
          matchMessage + '" but it was rejected with ' + error);
      }
    }
  });
};

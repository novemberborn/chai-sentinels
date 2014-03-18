'use strict';

var sentinels = require('../');

describe('Assert interface:', function() {
  describe('when the value is a sentinel', function() {
    shouldPass('.isSentinel(val)', function() {
      return assert.isSentinel(new sentinels.Sentinel());
    });

    shouldFail('.isNotSentinel(val)', function() {
      return assert.isSentinel({});
    }, 'to be a Sentinel');

    describe('and we’re expecting that sentinel', function() {
      shouldPass('.matchingSentinels()', function() {
        return assert.matchingSentinels(sentinels.foo, sentinels.foo);
      });


      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels(sentinels.foo, sentinels.foo);
      }, 'to not equal');
    });

    describe('and we’re not expecting that sentinel', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels(sentinels.foo, sentinels.bar);
      }, 'to equal');

      shouldPass('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels(sentinels.foo, sentinels.bar);
      });
    });
  });

  describe('when the value is not a sentinel', function() {
    shouldFail('.isSentinel()', function() {
      return assert.isSentinel('foo');
    }, 'to be a Sentinel');

    shouldPass('.isNotSentinel()', function() {
      return assert.isNotSentinel('foo');
    });

    shouldFail('.matchingSentinels()', function() {
      return assert.matchingSentinels(sentinels.foo, 'foo');
    }, 'to be a Sentinel');

    shouldFail('.nonMatchingSentinels()', function() {
      return assert.nonMatchingSentinels(sentinels.foo, 'foo');
    }, 'to be a Sentinel');
  });

  describe('when the value is an array', function() {
    describe('but an object is expected', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels([], { foo: sentinels.foo });
      }, 'to be an object');

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels([], { foo: sentinels.foo });
      }, 'to be an object');
    });

    describe('that is empty', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels([], [sentinels.foo]);
      }, 'not to be empty');

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels([], [sentinels.foo]);
      }, 'not to be empty');
    });

    describe('that contains a non-Sentinel value', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels(['foo'], [sentinels.foo]);
      }, 'to be a Sentinel');

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels(['foo'], [sentinels.foo]);
      }, 'to be a Sentinel');
    });

    describe('that contains fewer values than expected', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels([sentinels.foo], [
          sentinels.foo,
          sentinels.bar
        ]);
      }, 'to have a length of');

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels([sentinels.foo], [
          sentinels.foo,
          sentinels.bar
        ]);
      }, 'to have a length of');
    });

    describe('that contains more values than expected', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels([
          sentinels.foo,
          sentinels.bar
        ], [sentinels.foo]);
      }, 'to have a length of');

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels([
          sentinels.foo,
          sentinels.bar
        ], [sentinels.foo]);
      }, 'to have a length of');
    });

    describe('that contains expected sentinels, in order', function() {
      shouldPass('.matchingSentinels()', function() {
        return assert.matchingSentinels([
          sentinels.foo,
          sentinels.bar
        ], [
          sentinels.foo,
          sentinels.bar
        ]);
      });

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels([
          sentinels.foo,
          sentinels.bar
        ], [
          sentinels.foo,
          sentinels.bar
        ]);
      }, /some sentinels of .+ to not equal/);
    });

    describe('that contains mismatched sentinels', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels([
          sentinels.foo,
          sentinels.bar
        ], [
          sentinels.bar,
          sentinels.foo
        ]);
      }, /all sentinels of .+ to equal/);

      shouldPass('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels([
          sentinels.foo,
          sentinels.bar
        ], [
          sentinels.bar,
          sentinels.foo
        ]);
      });
    });

    describe('that contains aligned sparse values', function() {
      shouldPass('.matchingSentinels()', function() {
        return assert.matchingSentinels([
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ], [
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ]);
      });

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels([
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ], [
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ]);
      }, /some sentinels of .+ to not equal/);
    });

    describe('that contains misaligned sparse values', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels([
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ], [
          /*sparse*/,
          sentinels.bar,
          sentinels.foo
        ]);
      }, /all sentinels of .+ to equal/);

      shouldPass('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels([
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ], [
          /*sparse*/,
          sentinels.bar,
          sentinels.foo
        ]);
      });
    });
  });

  describe('when the value is an object', function() {
    describe('but an array is expected', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels({}, [sentinels.foo]);
      }, 'to be an array');

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels({}, [sentinels.foo]);
      }, 'to be an array');
    });

    describe('that is empty', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels({}, { foo: sentinels.foo });
      }, 'not to be empty');

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels({}, { foo: sentinels.foo });
      }, 'not to be empty');
    });

    describe('that contains a non-Sentinel value', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels({
          foo: 'foo'
        }, {
          foo: sentinels.foo
        });
      }, 'to be a Sentinel');

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels({
          foo: 'foo'
        }, {
          foo: sentinels.foo
        });
      }, 'to be a Sentinel');
    });

    describe('that contains fewer values than expected', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels({
          foo: sentinels.foo
        }, {
          foo: sentinels.foo,
          bar: sentinels.bar
        });
      }, 'to deeply equal');

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels({
          foo: sentinels.foo
        }, {
          foo: sentinels.foo,
          bar: sentinels.bar
        });
      }, 'to deeply equal');
    });

    describe('that contains more values than expected', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        }, {
          foo: sentinels.foo
        });
      }, 'to deeply equal');

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        }, {
          foo: sentinels.foo
        });
      }, 'to deeply equal');
    });

    describe('that contains expected sentinels, in order', function() {
      shouldPass('.matchingSentinels()', function() {
        return assert.matchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        }, {
          foo: sentinels.foo,
          bar: sentinels.bar
        });
      });

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        }, {
          foo: sentinels.foo,
          bar: sentinels.bar
        });
      }, /some sentinels of .+ to not equal/);
    });

    describe('that contains expected sentinels, out of order', function() {
      shouldPass('.matchingSentinels()', function() {
        return assert.matchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        }, {
          bar: sentinels.bar,
          foo: sentinels.foo
        });
      });

      shouldFail('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        }, {
          bar: sentinels.bar,
          foo: sentinels.foo
        });
      }, /some sentinels of .+ to not equal/);
    });

    describe('that contains mismatched sentinels', function() {
      shouldFail('.matchingSentinels()', function() {
        return assert.matchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        }, {
          foo: sentinels.bar,
          bar: sentinels.foo
        });
      }, /all sentinels of .+ to equal/);

      shouldPass('.nonMatchingSentinels()', function() {
        return assert.nonMatchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        }, {
          foo: sentinels.bar,
          bar: sentinels.foo
        });
      });
    });
  });

  describe('asserting the expected value', function() {
    describe('if the expected value is an array', function() {
      describe('that is empty', function() {
        shouldFail('.matchingSentinels()', function() {
          return assert.matchingSentinels(null, []);
        }, /validating expected value: .+ not to be empty/);
      });

      describe('that contains a non-Sentinel value', function() {
        shouldFail('.matchingSentinels()', function() {
          return assert.matchingSentinels(null, ['foo']);
        }, /validating expected value at index 0: .+ to be a Sentinel/);
      });
    });

    describe('if the expected value is an object', function() {
      describe('that is empty', function() {
        shouldFail('.matchingSentinels()', function() {
          return assert.matchingSentinels(null, {});
        }, /validating expected value: .+ not to be empty/);
      });

      describe('that contains a non-Sentinel value', function() {
        shouldFail('.matchingSentinels()', function() {
          return assert.matchingSentinels(null, { foo: 'foo' });
        }, /validating expected value of key 'foo': .+ to be a Sentinel/);
      });
    });

    describe(
      'if the expected value is neither an array nor an object',
      function() {
        shouldFail('.matchingSentinels()', function() {
          return assert.matchingSentinels(null, 'foo');
        }, /validating expected value: .+ to be a Sentinel/);
      });
  });
});

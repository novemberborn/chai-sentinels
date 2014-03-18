'use strict';

var sentinels = require('../');

describe('Sentinel extensions:', function() {
  describe('when the value is a sentinel', function() {
    shouldPass('.to.be.a.sentinel', function() {
      return expect(sentinels.foo).to.be.a.sentinel;
    });

    shouldFail('.to.not.be.a.sentinel', function() {
      return expect(sentinels.foo).to.not.be.a.sentinel;
    }, 'to not be a Sentinel');


    describe('and we’re expecting that sentinel', function() {
      shouldPass('.to.be.matchingSentinels', function() {
        return expect(sentinels.foo).to.be.matchingSentinels(sentinels.foo);
      });


      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect(sentinels.foo).to.not.be.matchingSentinels(sentinels.foo);
      }, 'to not equal');
    });

    describe('and we’re not expecting that sentinel', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect(sentinels.foo).to.be.matchingSentinels(sentinels.bar);
      }, 'to equal');

      shouldPass('.to.not.be.matchingSentinels', function() {
        return expect(sentinels.foo).to.not.be.matchingSentinels(sentinels.bar);
      });
    });
  });

  describe('when the value is not a sentinel', function() {
    shouldFail('.to.be.a.sentinel', function() {
      return expect('foo').to.be.a.sentinel;
    }, 'to be a Sentinel');

    shouldPass('.to.not.be.a.sentinel', function() {
      return expect('foo').to.not.be.a.sentinel;
    });

    shouldFail('.to.be.matchingSentinels', function() {
      return expect('foo').to.be.matchingSentinels(sentinels.foo);
    }, 'to be a Sentinel');

    shouldFail('.to.not.be.matchingSentinels', function() {
      return expect('foo').to.not.be.matchingSentinels(sentinels.foo);
    }, 'to be a Sentinel');
  });

  describe('when the value is an array', function() {
    describe('but an object is expected', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect([]).to.be.matchingSentinels({ foo: sentinels.foo });
      }, 'to be an object');

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect([]).to.not.be.matchingSentinels({ foo: sentinels.foo });
      }, 'to be an object');
    });

    describe('that is empty', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect([]).to.be.matchingSentinels([sentinels.foo]);
      }, 'not to be empty');

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect([]).to.not.be.matchingSentinels([sentinels.foo]);
      }, 'not to be empty');
    });

    describe('that contains a non-Sentinel value', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect(['foo']).to.be.matchingSentinels([sentinels.foo]);
      }, 'to be a Sentinel');

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect(['foo']).to.not.be.matchingSentinels([sentinels.foo]);
      }, 'to be a Sentinel');
    });

    describe('that contains fewer values than expected', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect([sentinels.foo]).to.be.matchingSentinels([
          sentinels.foo,
          sentinels.bar
        ]);
      }, 'to have a length of');

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect([sentinels.foo]).to.not.be.matchingSentinels([
          sentinels.foo,
          sentinels.bar
        ]);
      }, 'to have a length of');
    });

    describe('that contains more values than expected', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect([
          sentinels.foo,
          sentinels.bar
        ]).to.be.matchingSentinels([sentinels.foo]);
      }, 'to have a length of');

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect([
          sentinels.foo,
          sentinels.bar
        ]).to.not.be.matchingSentinels([sentinels.foo]);
      }, 'to have a length of');
    });

    describe('that contains expected sentinels, in order', function() {
      shouldPass('.to.be.matchingSentinels', function() {
        return expect([
          sentinels.foo,
          sentinels.bar
        ]).to.be.matchingSentinels([
          sentinels.foo,
          sentinels.bar
        ]);
      });

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect([
          sentinels.foo,
          sentinels.bar
        ]).to.not.be.matchingSentinels([
          sentinels.foo,
          sentinels.bar
        ]);
      }, /some sentinels of .+ to not equal/);
    });

    describe('that contains mismatched sentinels', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect([
          sentinels.foo,
          sentinels.bar
        ]).to.be.matchingSentinels([
          sentinels.bar,
          sentinels.foo
        ]);
      }, /all sentinels of .+ to equal/);

      shouldPass('.to.not.be.matchingSentinels', function() {
        return expect([
          sentinels.foo,
          sentinels.bar
        ]).to.not.be.matchingSentinels([
          sentinels.bar,
          sentinels.foo
        ]);
      });
    });

    describe('that contains aligned sparse values', function() {
      shouldPass('.to.be.matchingSentinels', function() {
        return expect([
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ]).to.be.matchingSentinels([
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ]);
      });

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect([
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ]).to.not.be.matchingSentinels([
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ]);
      }, /some sentinels of .+ to not equal/);
    });

    describe('that contains misaligned sparse values', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect([
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ]).to.be.matchingSentinels([
          /*sparse*/,
          sentinels.bar,
          sentinels.foo
        ]);
      }, /all sentinels of .+ to equal/);

      shouldPass('.to.not.be.matchingSentinels', function() {
        return expect([
          sentinels.foo,
          /*sparse*/,
          sentinels.bar
        ]).to.not.be.matchingSentinels([
          /*sparse*/,
          sentinels.bar,
          sentinels.foo
        ]);
      });
    });
  });

  describe('when the value is an object', function() {
    describe('but an array is expected', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect({}).to.be.matchingSentinels([sentinels.foo]);
      }, 'to be an array');

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect({}).to.not.be.matchingSentinels([sentinels.foo]);
      }, 'to be an array');
    });

    describe('that is empty', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect({}).to.be.matchingSentinels({ foo: sentinels.foo });
      }, 'not to be empty');

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect({}).to.not.be.matchingSentinels({ foo: sentinels.foo });
      }, 'not to be empty');
    });

    describe('that contains a non-Sentinel value', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect({
          foo: 'foo'
        }).to.be.matchingSentinels({
          foo: sentinels.foo
        });
      }, 'to be a Sentinel');

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect({
          foo: 'foo'
        }).to.not.be.matchingSentinels({
          foo: sentinels.foo
        });
      }, 'to be a Sentinel');
    });

    describe('that contains fewer values than expected', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect({
          foo: sentinels.foo
        }).to.be.matchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        });
      }, 'to deeply equal');

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect({
          foo: sentinels.foo
        }).to.not.be.matchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        });
      }, 'to deeply equal');
    });

    describe('that contains more values than expected', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect({
          foo: sentinels.foo,
          bar: sentinels.bar
        }).to.be.matchingSentinels({
          foo: sentinels.foo
        });
      }, 'to deeply equal');

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect({
          foo: sentinels.foo,
          bar: sentinels.bar
        }).to.not.be.matchingSentinels({
          foo: sentinels.foo
        });
      }, 'to deeply equal');
    });

    describe('that contains expected sentinels, in order', function() {
      shouldPass('.to.be.matchingSentinels', function() {
        return expect({
          foo: sentinels.foo,
          bar: sentinels.bar
        }).to.be.matchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        });
      });

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect({
          foo: sentinels.foo,
          bar: sentinels.bar
        }).to.not.be.matchingSentinels({
          foo: sentinels.foo,
          bar: sentinels.bar
        });
      }, /some sentinels of .+ to not equal/);
    });

    describe('that contains expected sentinels, out of order', function() {
      shouldPass('.to.be.matchingSentinels', function() {
        return expect({
          foo: sentinels.foo,
          bar: sentinels.bar
        }).to.be.matchingSentinels({
          bar: sentinels.bar,
          foo: sentinels.foo
        });
      });

      shouldFail('.to.not.be.matchingSentinels', function() {
        return expect({
          foo: sentinels.foo,
          bar: sentinels.bar
        }).to.not.be.matchingSentinels({
          bar: sentinels.bar,
          foo: sentinels.foo
        });
      }, /some sentinels of .+ to not equal/);
    });

    describe('that contains mismatched sentinels', function() {
      shouldFail('.to.be.matchingSentinels', function() {
        return expect({
          foo: sentinels.foo,
          bar: sentinels.bar
        }).to.be.matchingSentinels({
          foo: sentinels.bar,
          bar: sentinels.foo
        });
      }, /all sentinels of .+ to equal/);

      shouldPass('.to.not.be.matchingSentinels', function() {
        return expect({
          foo: sentinels.foo,
          bar: sentinels.bar
        }).to.not.be.matchingSentinels({
          foo: sentinels.bar,
          bar: sentinels.foo
        });
      });
    });
  });

  describe('asserting the expected value', function() {
    describe('if the expected value is an array', function() {
      describe('that is empty', function() {
        shouldFail('.to.be.matchingSentinels', function() {
          return expect().to.be.matchingSentinels([]);
        }, /validating expected value: .+ not to be empty/);
      });

      describe('that contains a non-Sentinel value', function() {
        shouldFail('.to.be.matchingSentinels', function() {
          return expect().to.be.matchingSentinels(['foo']);
        }, /validating expected value at index 0: .+ to be a Sentinel/);
      });
    });

    describe('if the expected value is an object', function() {
      describe('that is empty', function() {
        shouldFail('.to.be.matchingSentinels', function() {
          return expect().to.be.matchingSentinels({});
        }, /validating expected value: .+ not to be empty/);
      });

      describe('that contains a non-Sentinel value', function() {
        shouldFail('.to.be.matchingSentinels', function() {
          return expect().to.be.matchingSentinels({ foo: 'foo' });
        }, /validating expected value of key 'foo': .+ to be a Sentinel/);
      });
    });

    describe(
      'if the expected value is neither an array nor an object',
      function() {
        shouldFail('.to.be.matchingSentinels', function() {
          return expect().to.be.matchingSentinels('foo');
        }, /validating expected value: .+ to be a Sentinel/);
      });
  });
});

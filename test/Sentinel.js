'use strict';

var Sentinel = require('../').Sentinel;

describe('Sentinel:', function() {
  describe('Sentinel(label, propertiesObject)', function() {
    it('accepts numbers as labels, but stringifies them', function() {
      assert.propertyVal(new Sentinel(42), '_sentinel_label', '42');
    });

    it('accepts non-empty strings as labels', function() {
      assert.propertyVal(new Sentinel('str'), '_sentinel_label', 'str');
    });

    it('throws for unexpected label types', function() {
      [null, true, '', function() {}].forEach(function(label) {
        assert.throws(
          function() {
            return new Sentinel(label);
          },
          TypeError,
          'Expected label to be a non-empty string or number.',
          label + ''
        );
      });
    });

    it('defines properties using `propertiesObject`', function() {
      var s = new Sentinel('label', {
        foo: { value: 'foo' }
      });
      assert.propertyVal(s, 'foo', 'foo');
    });

    it('uses `label` as the `propertiesObject` if it’s an object', function() {
      var s = new Sentinel({
        foo: { value: 'foo' }
      }, {
        bar: { value: 'bar' }
      });
      assert.propertyVal(s, 'foo', 'foo');
      assert.notProperty(s, 'bar');
    });

    it('can be invoked without `new`', function() {
      /*jshint newcap:false*/
      var s = Sentinel('label', {
        foo: { value: 'foo' }
      });
      assert.instanceOf(s, Sentinel);
      assert.propertyVal(s, '_sentinel_label', 'label');
      assert.propertyVal(s, 'foo', 'foo');
    });
  });

  describe('.unary(arg)', function() {
    it('creates a new sentinel with only the first argument', function() {
      var s = Sentinel.unary('label', {
        foo: { value: 'foo' }
      });
      assert.instanceOf(s, Sentinel);
      assert.propertyVal(s, '_sentinel_label', 'label');
      assert.notProperty(s, 'foo');
    });

    it('can be called as a free function', function() {
      var unary = Sentinel.unary;
      assert.instanceOf(unary(), Sentinel);
    });
  });

  describe('#_sentinel_id', function() {
    it('is enumerable', function() {
      assert.sameMembers(Object.keys(new Sentinel()), ['_sentinel_id']);
    });

    it('cannot be changed', function() {
      assert.throws(function() {
        var s = new Sentinel();
        s._sentinel_id = 42;
      }, TypeError);
    });

    it('cannot be deleted', function() {
      assert.throws(function() {
        var s = new Sentinel();
        delete s._sentinel_id;
      }, TypeError);
    });

    it('cannot be configured', function() {
      assert.throws(function() {
        var s = new Sentinel();
        Object.defineProperty(s, '_sentinel_id', {
          value: 42
        });
      }, TypeError);
    });

    it('has increasing values', function() {
      var s1 = new Sentinel();
      var s2 = new Sentinel();
      assert.ok(s1._sentinel_id < s2._sentinel_id);
    });
  });

  describe('#_sentinel_label', function() {
    it('is not enumerable', function() {
      assert.sameMembers(Object.keys(new Sentinel('label')), ['_sentinel_id']);
    });

    it('cannot be changed', function() {
      assert.throws(function() {
        var s = new Sentinel('label');
        s._sentinel_label = 42;
      }, TypeError);
    });

    it('cannot be deleted', function() {
      assert.throws(function() {
        var s = new Sentinel('label');
        delete s._sentinel_label;
      }, TypeError);
    });

    it('cannot be configured', function() {
      assert.throws(function() {
        var s = new Sentinel('label');
        Object.defineProperty(s, '_sentinel_label', {
          value: 42
        });
      }, TypeError);
    });
  });

  describe('#inspect()', function() {
    it('only includes the ID if no label was set', function() {
      assert.match(new Sentinel().inspect(), /^\[Sentinel \d+\]$/);
    });

    it('includes the ID and label if label was set', function() {
      assert.match(new Sentinel('label').inspect(), /^\[Sentinel \d+ label\]$/);
    });
  });
});

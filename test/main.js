'use strict';

var main = require('../');
var assertions = require('../lib/assertions');

var FIELDS = [
  'foo', 'bar', 'baz', 'qux', 'quux', 'corge', 'grault', 'garply', 'waldo',
  'fred', 'plugh', 'xyzzy', 'thud'
];

describe('main:', function() {
  describe('exports a function', function() {
    it('installs the assertions', function() {
      var receivedArgs;
      var mockChai = {
        use: function() {
          receivedArgs = [].slice.call(arguments);
        }
      };

      main(mockChai);
      assert.deepEqual(receivedArgs, [assertions]);
    });
  });

  describe('has default sentinels', function() {
    FIELDS.forEach(function(name) {
      it('.' + name, function() {
        assert.instanceOf(main[name], main.Sentinel);
        assert.propertyVal(main[name], '_sentinel_label', name);
      });
    });
  });

  describe('.stubObject(length)', function() {
    it('restricts length from 1 up to and including 13', function() {
      [-1, 14].forEach(function(length) {
        assert.throws(
          function() {
            main.stubObject(length);
          },
          TypeError,
          'Expected 1 <= `length` <= 13',
          length + ''
        );
      });

      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].forEach(function(length) {
        assert.doesNotThrow(
          function() {
            main.stubObject(length);
          },
          length + ''
        );
      });
    });

    it('returns an object with up to `length` sentinels', function() {
      var length = Math.ceil(Math.random() * 13);
      var stub = main.stubObject(length);

      assert.lengthOf(Object.keys(stub), length);
      FIELDS.slice(0, length).forEach(function(name) {
        var msg = ['length = ', length, ', sentinel = ', name].join('');
        assert.instanceOf(stub[name], main.Sentinel, msg + ' (instanceOf)');
        assert.propertyVal(
          stub[name], '_sentinel_label', name, msg + ' (propertyVal)');
      });
    });

    it('defaults `length` to 3', function() {
      assert.lengthOf(Object.keys(main.stubObject()), 3);
      assert.lengthOf(Object.keys(main.stubObject('foo')), 3);
    });
  });

  describe('.stubArray(length)', function() {
    it('restricts length from 1 up to and including 13', function() {
      [-1, 14].forEach(function(length) {
        assert.throws(
          function() {
            main.stubArray(length);
          },
          TypeError,
          'Expected 1 <= `length` <= 13',
          length + ''
        );
      });

      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].forEach(function(length) {
        assert.doesNotThrow(
          function() {
            main.stubArray(length);
          },
          length + ''
        );
      });
    });

    it('returns an object with up to `length` sentinels', function() {
      var length = Math.ceil(Math.random() * 13);
      var stub = main.stubArray(length);

      assert.lengthOf(stub, length);
      FIELDS.slice(0, length).forEach(function(name, ix) {
        var msg = ['length = ', length, ', sentinel = ', name].join('');
        assert.instanceOf(stub[ix], main.Sentinel, msg + ' (instanceOf)');
        assert.propertyVal(
          stub[ix], '_sentinel_label', name, msg + ' (propertyVal)');
      });
    });

    it('defaults `length` to 3', function() {
      assert.lengthOf(main.stubArray(), 3);
      assert.lengthOf(main.stubArray('foo'), 3);
    });
  });
});

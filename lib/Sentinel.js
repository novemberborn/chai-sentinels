'use strict';

// # Sentinel

var instanceCount = 0;

// ## Sentinel(label, propertiesObject)
// Constructor for a unique sentinel value. Each value has a different
// `_sentinel_id`. This property is enumerable but not configurable or writable,
// which allows it to be used with deep-equal assertions.

// Pass `label` for better error output. It can be a number or a non-empty
// string. If an object it's assumed to be `propertiesObject`, and the second
// argument is ignored.

// If truey, `propertiesObject` is used to define properties on the sentinel
// instance.

// Can be used without `new`.
function Sentinel(label, propertiesObject) {
  if (!(this instanceof Sentinel)) {
    return new Sentinel(label, propertiesObject);
  }

  if (typeof label === 'object' && label) {
    propertiesObject = label;
    label = undefined;
  }

  if (typeof label === 'number') {
    label = String(label);
  } else if (typeof label !== 'undefined') {
    if (typeof label !== 'string' || !label) {
      throw new TypeError('Expected label to be a non-empty string or number.');
    }
  }

  Object.defineProperties(this, {
    _sentinel_id: {
      value: ++instanceCount,
      //enumerable to work with Chai's `deep-eql`.
      enumerable: true
    },

    _sentinel_label: {
      value: label
    }
  });

  if (propertiesObject) {
    Object.defineProperties(this, propertiesObject);
  }
}
module.exports = Sentinel;

// ## Sentinel.unary(arg)
// Creates a new `Sentinel` instance by only passing the first argument. Useful
// as an iterator for array maps, e.g.:

// ```js
// ['foo', 'bar'].map(Sentinel.unary);
// ```
Sentinel.unary = function(arg) {
  return new Sentinel(arg);
};

// ## Sentinel#inspect()
// Formats the sentinel for logging. Will include the label if specified.
Sentinel.prototype.inspect = function() {
  var str = '[Sentinel ' + this._sentinel_id;
  if (this._sentinel_label) {
    str += ' ' + this._sentinel_label;
  }
  return str + ']';
};

'use strict';

const crypto = require('crypto');
const expandString = require('expand-string');
const _ = {};
_.defaults = require('lodash.defaults');


function transformBuffer(buffer, chars) {
  let result = new Array(buffer.length);
  let cursor = 0;
  for (let i = 0; i < buffer.length; ++i) {
    cursor += buffer[i];
    result[i] = chars[cursor % chars.length];
  }
  return result.join('');
}

const DEFAULT_OPTIONS = {
  chars: '0-9a-zA-Z',
  length: 32
};

function TokenGenerator(options) {
  if (typeof options === 'string') {
    options = {chars: options};
  } else if (typeof options === 'number') {
    options = {length: options};
  }

  options = _.defaults({}, options, DEFAULT_OPTIONS);
  if (typeof options.chars !== 'string') {
    throw new TypeError('`options.chars` must be a string');
  }
  if (typeof options.length !== 'number') {
    throw new TypeError('`options.length` must be a number');
  }

  options.chars = expandString(options.chars, {returnArray: true});
  this._options = options;
}

TokenGenerator.prototype.generate = function generate(length, callback) {
  if (typeof length === 'function') {
    callback = length;
    length = undefined;
  } else if (callback && typeof callback !== 'function') {
    throw new TypeError('`callback` must be a function');
  }

  if (typeof length === 'undefined') {
    length = this._options.length;
  } else if (typeof length !== 'number') {
    throw new TypeError('`length` must be a number');
  }

  let chars = this._options.chars;

  if (callback) {
    crypto.randomBytes(length, (err, buffer) => {
      if (err) {
        return callback(err);
      }
      let result = transformBuffer(buffer, chars);
      callback(null, result);
    });
  } else {
    let buffer = crypto.randomBytes(length);
    return transformBuffer(buffer, chars);
  }
};

module.exports = TokenGenerator;


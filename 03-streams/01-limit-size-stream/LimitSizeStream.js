const fs = require('fs');
const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit || 0;
    this.usedLimit = 0;
  }

  _transform(chunk, encoding, callback) {
    if (chunk.length + this.usedLimit > this.limit) {
      callback(new LimitExceededError());
    } else {
      this.usedLimit = this.usedLimit + chunk.length;
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;

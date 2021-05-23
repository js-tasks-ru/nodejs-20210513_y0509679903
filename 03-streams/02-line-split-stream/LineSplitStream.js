const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.buffer = '';
  }

  _transform(chunk, encoding = this.encoding, callback) {
    const data = chunk.toString().split(`${os.EOL}`);

    if (data.length === 1) {
      this.buffer = this.buffer ? this.buffer + data.shift() : data.shift();
    } else {
      if (this.buffer) {
        data[0] = this.buffer + data[0];
        this.buffer = data.pop();
      }

      data.forEach((line) => {
        this.push(line);
      });
    }

    callback();
  }

  _final(callback) {
    if (this.buffer) {
      this.push(this.buffer);
    }
    callback();
  }
}


module.exports = LineSplitStream;

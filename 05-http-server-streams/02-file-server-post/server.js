const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');

const server = new http.Server();

const noop = () => {};
const withStatus = (res) => (statusCode) => {
  res.statusCode = statusCode;
  return res;
};

server.on('request', (req, res) => {
  const resStatus = withStatus(res);
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);
  const transform = new LimitSizeStream({limit: 1000000});

  if (pathname.includes('/')) {
    return resStatus(400).end('Nested folders are not supported');
  }

  try {
    switch (req.method) {
      case 'POST':
        fs.stat(filepath, (error, stats) => {
          if (stats && stats.isFile()) {
            return resStatus(409).end('File already exists');
          }

          if (error) {
            const writeStream = fs.createWriteStream(filepath);
            req
                .pipe(transform)
                .pipe(writeStream);

            transform.on('error', function(err) {
              if (err.code === 'LIMIT_EXCEEDED') {
                fs.unlink(filepath, noop);
                writeStream.close();
                return resStatus(413).end('File limit has been exceeded.');
              } else {
                if (err) {
                  return resStatus(500).end('Some error occurred.');
                }
              }
            });
            req.on('close', () => {
              if (!writeStream.writableFinished) {
                fs.unlink(filepath, noop);
                writeStream.close();
              }
            });
            writeStream.on('finish', () => {
              return resStatus(201).end('Success');
            });
          }
        });
        break;

      default:
        return resStatus(501).end('Not implemented');
    }
  } catch (error) {
    console.log('error', Object.entries(error));
  }
});

module.exports = server;

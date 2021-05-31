const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

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

  if (pathname.includes('/')) {
    return resStatus(400).end('Nested folders are not supported');
  }

  switch (req.method) {
    case 'DELETE':
      fs.stat(filepath, (error, stats) => {
        if (error) {
          return resStatus(404).end('File not found');
        }

        if (stats && stats.isFile()) {
          fs.unlink(filepath, noop);
          return resStatus(200).end('Success');
        }
      });
      break;
    default:
      return resStatus(501).end('Not implemented');
  }
});

module.exports = server;

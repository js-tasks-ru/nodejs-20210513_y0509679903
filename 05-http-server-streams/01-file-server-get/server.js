const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();
const withStatus = (res) => (statusCode) => {
  res.statusCode = statusCode;
  return res;
};

server.on('request', (req, res) => {
  const resStatus = withStatus(res);
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/')) {
    return resStatus(400).end('Nested folders are not supported');
  }

  switch (req.method) {
    case 'GET':
      const filepath = path.join(__dirname, 'files', pathname);
      const readStream = fs.createReadStream(filepath);
      readStream.on('open', function() {
        readStream.pipe(res);
      });
      readStream.on('error', (error) => {
        if (error.code === 'ENOENT') {
          return resStatus(404).end('File not found');
        } else {
          return resStatus(500).end('Server error');
        }
      });
      break;
    default:
      return resStatus(501).end('Not implemented');
  }
});

module.exports = server;

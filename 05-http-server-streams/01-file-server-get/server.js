const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  if (pathname.includes('/')) {
    res.statusCode = 400;
    res.end('Nested folders are not supported');
  }

  try {
    const filepath = path.join(__dirname, 'files', pathname);
    const data = fs.readFileSync(filepath);

    switch (req.method) {
      case 'GET':
        res.statusCode = 200;
        res.end(data);
        break;
      default:
        res.statusCode = 501;
        res.end('Not implemented');
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      res.statusCode = 404;
      res.end('File not found');
    } else {
      res.statusCode = 500;
      res.end('Server error');
    }
  }
});

module.exports = server;

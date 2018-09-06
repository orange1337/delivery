/*
  Created by Rost CI/CD 
*/
const createHandler = require('github-webhook-handler');
const handler       = createHandler({ path: '/delivery', secret: 'cryptolionsDelivery1337' })

process.on('uncaughtException', (err) => {
    console.log(`======= UncaughtException Main Server :  ${err}`);
});


// ################### create http node express server
const debug = require('debug')('asd:server');
const http = require('http');
const port = normalizePort(process.env.PORT || '3040');

const server = http.createServer((req, res) => {
    handler(req, res,  (err) => {
      res.statusCode = 404
      res.end('no such location');
    });
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

require('./router/main.router')(handler);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.info('Listening on ' + bind);
}

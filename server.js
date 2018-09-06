/*
  Created by Rost CI/CD 
*/
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const helmet        = require('helmet');
const compression   = require('compression');

process.on('uncaughtException', (err) => {
    console.log(`======= UncaughtException Main Server :  ${err}`);
});

const app  = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());

// ################### create http node express server
const debug = require('debug')('asd:server');
const http = require('http');
const port = normalizePort(process.env.PORT || '3040');
app.set('port', port);
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);


require('./router/main.router')(app);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.error('=====Page not Found ', err);
  // render the error page
  res.status(err.status || 500).end('Page not Found');
});

function normalizePort(val) {
  let port = parseInt(val, 10);

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

  let bind = typeof port === 'string'
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
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
  console.info('Listening on ' + bind);
}

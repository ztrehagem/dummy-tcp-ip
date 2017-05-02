const net = require('net');
const listener = require('./listener');

const server = net.createServer(listener);
server.listen(6565, ()=> {
  console.log('listening...');
});

const net = require('net');
const fs = require('fs');
const Data = require('../common/data');
const Dtcp = require('../common/dtcp');
const Dudp = require('../common/dudp');
const Dip = require('../common/dip');

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('usage: npm run client -- <type> <filename>');
  return;
}

const l2Type = args.shift();
const filename = args.shift();

if (!['dtcp','dudp'].includes(l2Type)) {
  console.log('usage: npm run client -- <type> <filename>');
  console.log('<type> must be `dtcp` or `dudp`');
  return;
}

fs.open(filename, 'r', (err, fd)=> {
  if (err) {
    console.error(err.toString());
    return;
  }
  read(fd);
});

function read(fd, position = 0) {
  const buf = Buffer.alloc(Data.MAX_SIZE);

  fs.read(fd, buf, 0, buf.length, position, (err, bytesRead, buf)=> {
    if (err) {
      console.error(err.toString());
      return;
    }
    if (bytesRead) {
      send(buf.slice(0, bytesRead));
    }
    if (Data.MAX_SIZE <= bytesRead) {
      read(fd, position + bytesRead);
    }
  });
}

function send(buf) {
  const client = net.createConnection(6565, 'localhost', ()=> {
    console.log('--- layer 3 ---');
    const l3 = new Data(buf);
    l3.preview();

    console.log('--- layer 2 ---');
    const l2 = buildLayer2(l3, l2Type);
    l2.preview();

    console.log('--- layer 1 ---');
    const l1 = buildLayer1(l2);
    l1.preview();

    const serial = l1.serialize();
    client.write(serial);
    client.end();
  });
}

function buildLayer2(l3, type) {
  switch (type) {
    case 'dtcp': return Dtcp.build(l3);
    case 'dudp': return Dudp.build(l3);
  }
}

function buildLayer1(l2) {
  return Dip.build(l2);
}

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

// TODO openとreadで1024バイト毎に分割する
fs.readFile(filename, (err, data)=> {
  if (err) {
    console.log(err.toString());
    return;
  }

  const client = net.createConnection(6565, 'localhost');

  client.on('connect', ()=> {
    console.log('--- layer 3 ---');
    const l3 = new Data(data);
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
});

function buildLayer2(l3, type) {
  switch (type) {
    case 'dtcp': return Dtcp.build(l3);
    case 'dudp': return Dudp.build(l3);
  }
}

function buildLayer1(l2) {
  return Dip.build(l2);
}

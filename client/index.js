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

const l2Type = parseInt(args.shift());
const filename = args.shift();

if (![1,2].includes(l2Type)) {
  console.log('usage: npm run client -- <type> <filename>');
  console.log('<type> must be `1` or `2`');
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
    const l3 = new Data(data);
    console.log(l3);
    const l2 = (()=> {
      switch (l2Type) {
        case 1: return new Dtcp(l3.serialize());
        case 2: return new Dudp(l3.serialize());
      }
    })();
    console.log(l2);
    const l1 = new Dip(l2.serialize(), l2Type);
    console.log(l1);
    const serial = l1.serialize();
    console.log(serial);

    client.write(serial);

    client.end();
  });
});

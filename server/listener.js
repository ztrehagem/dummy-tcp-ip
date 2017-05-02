const Data = require('../common/data');
const Dtcp = require('../common/dtcp');
const Dudp = require('../common/dudp');
const Dip = require('../common/dip');

module.exports = (c)=> {
  console.log('connected.');

  c.on('data', (data)=> {
    console.log(data);
    const l1 = Dip.parse(data);
    console.log(l1);
    const l2 = (()=> {
      switch (l1.type) {
        case 1: return Dtcp.parse(l1.payload);
        case 2: return Dudp.parse(l1.payload);
      }
    })();
    console.log(l2);
    const l3 = Data.parse(l2.payload);
    console.log(l3);
  });
  c.on('close', ()=> {
    console.log('closed.');
  });
};

const Data = require('../common/data');
const Dtcp = require('../common/dtcp');
const Dudp = require('../common/dudp');
const Dip = require('../common/dip');
const utils = require('../common/utils');

module.exports = (c)=> {
  console.log('=== connected ===');

  c.on('data', (data)=> {

    try {
      console.log('--- packet raw ---');
      console.log(utils.bufferToInspectString(data));

      console.log('--- layer 1 ---');
      const l1 = Dip.parse(data);
      l1.preview();

      console.log('--- layer 2 ---');
      const l2 = l1.extract();
      l2.preview();

      console.log('--- layer 3 ---');
      const l3 = l2.extract();
      l3.preview();

      console.log('--- content ---');
      console.log(l3.payload.toString());
    } catch (e) {
      console.error(e);
    }

  });
  c.on('close', ()=> {
    console.log('=== closed ===');
  });
};

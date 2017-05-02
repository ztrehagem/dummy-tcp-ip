const utils = require('./utils');

module.exports = class Dtcp {
  constructor(payload, len, digest = null, type = 1) {
    this.payload = payload;
    this.length = payload.length;
    this.type = type;
    this.digest = digest || (()=> {
      const str = utils.md5digest(payload.toString());
      return utils.bytesDigest(str);
    })();
  }

  serialize() {
    // type(4), len(4), digest(16), payload
    const dtcp = Buffer.alloc(8);
    dtcp.writeUInt32BE(this.type, 0);
    dtcp.writeUInt32BE(this.len, 4);
    return Buffer.concat([dtcp, this.digest, this.payload]);
  }

  static parse(buffer) {
    const type = buffer.readUInt32BE(0);
    const len = buffer.readUInt32BE(4);
    const digest = buffer.slice(8, 24);
    const payload = buffer.slice(24);

    const payloadDigest = utils.md5digest(payload.toString());
    const digestString = utils.bytesDigestToString(digest);
    if (payloadDigest != digestString) {
      console.log('digest:', digestString);
      console.log('payload:', payloadDigest);
      throw new Error('invalid payload (dtcp)');
    }

    return new Dtcp(payload, len, digest, type);
  }
};

const Data = require('./data');
const utils = require('./utils');

module.exports = class Dtcp {
  constructor(payload, len, digest = null, type = 1) {
    this.payload = payload;
    this.len = payload.length;
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

  extract() {
    return Data.parse(this.payload);
  }

  preview() {
    console.log(`type   = ${this.type}`);
    console.log(`len    = ${this.len}`);
    const digest = utils.bufferToInspectString(this.digest);
    console.log(`digest = ${digest}`);
  }

  static build(l3) {
    return new Dtcp(l3.serialize());
  }

  static parse(buffer) {
    const type = buffer.readUInt32BE(0);
    const len = buffer.readUInt32BE(4);
    const digest = buffer.slice(8, 24);
    const payload = buffer.slice(24);

    const payloadDigestStr = utils.md5digest(payload.toString());
    const digestStr = utils.bytesDigestToString(digest);
    if (payloadDigestStr != digestStr) {
      console.log(`             digest: ${digestStr}`);
      console.log(`digest from payload: ${payloadDigestStr}`);
      throw new Error('invalid payload (dtcp)');
    }

    return new Dtcp(payload, len, digest, type);
  }
};

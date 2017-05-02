const Dtcp = require('./dtcp');
const Dudp = require('./dudp');

const CHILD_TYPES = [];
CHILD_TYPES[1] = Dtcp;
CHILD_TYPES[2] = Dudp;

module.exports = class Dip {
  constructor(payload, type, version = 1, ttl = 114514) {
    this.payload = payload;
    this.type = type;
    this.version = version;
    this.ttl = ttl;
  }

  serialize() {
    // type(4), version(4), ttl(4), payload
    const dip = Buffer.alloc(12);
    dip.writeUInt32BE(this.type, 0);
    dip.writeUInt32BE(this.version, 4);
    dip.writeUInt32BE(this.ttl, 8);
    return Buffer.concat([dip, this.payload]);
  }

  extract() {
    return CHILD_TYPES[this.type].parse(this.payload);
  }

  preview() {
    console.log(`type    = ${this.type}`);
    console.log(`version = ${this.version}`);
    console.log(`ttl     = ${this.ttl}`);
  }

  static build(l2) {
    const type = CHILD_TYPES.indexOf(l2.constructor);
    return new Dip(l2.serialize(), type);
  }

  static parse(buffer) {
    const type = buffer.readUInt32BE(0);
    const version = buffer.readUInt32BE(4);
    const ttl = buffer.readUInt32BE(8);
    const payload = buffer.slice(12);
    return new Dip(payload, type, version, ttl);
  }
};

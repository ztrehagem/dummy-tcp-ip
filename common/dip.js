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

  static parse(buffer) {
    const type = buffer.readUInt32BE(0);
    const version = buffer.readUInt32BE(4);
    const ttl = buffer.readUInt32BE(8);
    const payload = buffer.slice(12);
    return new Dip(payload, type, version, ttl);
  }
};

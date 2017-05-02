module.exports = class Dudp {
  constructor(payload, len, type = 1) {
    this.payload = payload;
    this.len = len || payload.length;
    this.type = type;
  }

  serialize() {
    // type(4), len(4), payload
    const dudp = Buffer.alloc(8);
    dudp.writeUInt32BE(this.type, 0);
    dudp.writeUInt32BE(this.len, 4);
    return Buffer.concat([dudp, this.payload]);
  }

  static parse(buffer) {
    const type = buffer.readUInt32BE(0);
    const len = buffer.readUInt32BE(4);
    const payload = buffer.slice(8);
    return new Dudp(payload, len, type);
  }
};

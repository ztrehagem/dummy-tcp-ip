module.exports = class Data {
  constructor(payload) { // Buffer
    this.payload = payload;
  }

  serialize() {
    return this.payload;
  }

  static parse(buffer) {
    return new Data(buffer);
  }
};

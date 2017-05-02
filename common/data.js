const utils = require('./utils');

module.exports = class Data {
  constructor(payload) {
    this.payload = payload;
  }

  serialize() {
    return this.payload;
  }

  preview() {
    console.log(utils.bufferToInspectString(this.payload));
  }

  static parse(buffer) {
    return new Data(buffer);
  }

  static get MAX_SIZE() {
    return 1024;
  }
};

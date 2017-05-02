const crypto = require('crypto');

exports.md5digest = (src, encode = 'utf8')=> {
  const md5 = crypto.createHash('md5');
  md5.update(src, encode);
  return md5.digest('hex');
};

exports.bytesDigest = (str)=> {
  const result = Buffer.alloc(16);
  for (var i = 0; i < 16; i++) {
    result.writeUInt8(parseInt(str.substr(i * 2, 2), 16), i);
  }
  return result;
};

exports.bytesDigestToString = (buffer)=> {
  let ret = '';
  for (var i = 0; i < 16; i++) {
    const byte = buffer[i].toString(16);
    ret += (byte.length == 1 ? '0' : '') + byte;
  }
  return ret;
};

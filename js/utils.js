  const DEBUG = true;

    function ua2hex(ua) {
        var h = '';
        for (var i = 0; i < ua.length; i++) {
            h += pad(ua[i].toString(16),2);
        }
        return h;
    }
  
  function generate_mobilepass_token(activ, index) {
      message = new Uint8Array(8);
      for (i = 0; i < 8; i++) {
          message[7 - i] = index & 0xff;
          index >>= 8;
      };
      entropy = "";
      activ = activ.replace(/[-]+/g, "");
      for (i = 1; i < activ.length + 1; i++) {
          if (i % 5) entropy += activ.charAt(i - 1)
      };
      entropy = base32_decode(entropy)
      if (DEBUG) console.log("key : " + ua2hex(entropy));
      key = asmCrypto.SHA256.bytes(concatArray(entropy, new Uint8Array([0, 0, 0, 0])));
      if (DEBUG) console.log("key : " + ua2hex(key));
      h = asmCrypto.HMAC_SHA256.bytes(message, key);
      if (DEBUG) console.log("hash : " + ua2hex(h));
      offset = h[h.length - 1] & 0xf;
      h = (h[offset] & 0x7f) << 24 | (h[offset + 1] & 0xff) << 16 | (h[offset + 2] & 0xff) << 8 | (h[offset + 3] & 0xff);
      return pad(h % 1000000, 6);
  }
  
  function str2ab(str) {
      var buf = new ArrayBuffer(str.length);
      var bufView = new Uint8Array(buf);
      for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
      }
      return bufView;
  }

  function base32_decode_data(data) {
      var b32x = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      var dst = ""
      for (i = 0; i < data.length - 7; i += 8) {
          a = b32x.indexOf(data[i + 0])
          b = b32x.indexOf(data[i + 1])
          c = b32x.indexOf(data[i + 2])
          d = b32x.indexOf(data[i + 3])
          e = b32x.indexOf(data[i + 4])
          f = b32x.indexOf(data[i + 5])
          g = b32x.indexOf(data[i + 6])
          h = b32x.indexOf(data[i + 7])
          dst += String.fromCharCode((a << 3) | (b >>> 2))
          if (data[i + 3] != '=')
              dst += String.fromCharCode(((b << 6) & 0xC0) | (c << 1) | ((d >>> 4) & 0x01))
          if (data[i + 4] != '=')
              dst += String.fromCharCode(((d << 4) & 0xF0) | (e >>> 1))
          if (data[i + 6] != '=')
              dst += String.fromCharCode(((e << 7) & 0x80) | (f << 2) | (g >>> 3))
          if (data[i + 7] != '=')
              dst += String.fromCharCode(((g << 5) & 0xE0) | h)
      }
      return str2ab(dst);
  };
  
  function concatArray(a, b) {
      var catArray = new Uint8Array(a.byteLength + b.byteLength);
      catArray.set(new Uint8Array(a), 0);
      catArray.set(new Uint8Array(b), a.byteLength);
      return catArray;
  }

  function base32_decode(str) {
      return base32_decode_data(str.toUpperCase())
  };
  
  function checkLogin(l){
      return ((l.search(/[^a-z0-9]/) === -1) && (l.length > 3))
  }
  
  function checkKey(l){
      l = l.toUpperCase(); 
      return ((l.search(/[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}\-[A-Z0-9]{5}/) !== -1) && (l.length === 23))
  }
  
  function checkIndex(l){
      return ((l.toString().search(/[^0-9]+/) === -1) && (l.toString().length > 0))
  }
  
  function pad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length-size);
  }
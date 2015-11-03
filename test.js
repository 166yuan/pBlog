var crypto = require('crypto');

var encrptPasswd = function (password,sha1) {
      if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', sha1)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  }

  var sha1 = '1173399916730';

 var result =  encrptPasswd("qwe",sha1);
 console.log(result);
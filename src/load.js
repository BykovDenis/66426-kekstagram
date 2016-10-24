// Загружаем переменную в память

'use strict';

module.exports = function(url, callback) {

  var __callBackName = 'cb' + Date.now();

  window[__callBackName] = function(data) {
    callback(data);
    script.parentNode.removeChild(script);
  };

  var script = document.createElement('script');
  script.src = url + '?callback=' + __callBackName;
  document.body.appendChild(script);
};


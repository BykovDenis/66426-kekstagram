// Загружаем переменную в память

'use strict';

module.exports = function(url, params, callback) {

  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    try {
      if (xhr.status === 200 && xhr.readyState === 4) {
        callback(JSON.parse(xhr.response));
      }
    } catch(e) {
      console.log(e);
    }
    return false;
  };

  params.from = params.from || 0;
  params.to = params.to || 12;
  params.filter = params.filter || '';
  var urlWithParams = url + '?from=' + params.from + '&to=' + params.to + '&filter=' + params.filter;
  xhr.open('GET', urlWithParams);
  xhr.send();

};


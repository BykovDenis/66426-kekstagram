// Загружаем переменную в память

'use strict';

module.exports = function(url, params, callback) {

  var xhr = new XMLHttpRequest();

  xhr.onload = function() {
    try {
      if (xhr.status === 200 && xhr.readyState === 4) {
        return callback(JSON.parse(xhr.response));
      }
    } catch(e) {
      console.log(e);
    }
  };
  params.from = params.from ? params.from : 0;
  params.to = params.to ? params.to : 50;
  params.filter = params.filter ? params.filter : '';
  var urlWithParams = url + '?from=' + params.from + '&to=' + params.to + '&filter=' + params.filter;
  xhr.open('GET', urlWithParams, true);
  xhr.send();

};


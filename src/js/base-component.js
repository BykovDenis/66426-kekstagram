'use strict';

var BaseComponent = function() {};

BaseComponent.prototype.imgSource = function(el, url) {
  el.src = url;
};

BaseComponent.prototype.clearURLHash = function() {
  if(window.location.hash) {
    window.location.hash = '';
  }
};

BaseComponent.prototype.hashchange = function(el) {
  window.addEventListener('hashchange', el);
};

module.exports = BaseComponent;

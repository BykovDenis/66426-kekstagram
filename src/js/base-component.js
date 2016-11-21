'use strict';

var BaseComponent = function() {};

BaseComponent.prototype.loadingError = function(element) {
  if(element) {
    element.classList.add('picture-load-failure');
  }
};

module.exports = BaseComponent;

'use strict';

var BaseComponent = function() {};

BaseComponent.prototype.loadingError = function() {
  if(this.element) {
    this.element.classList.add('picture-load-failure');
  }
};

module.exports = BaseComponent;

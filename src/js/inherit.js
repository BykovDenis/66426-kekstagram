'use strict';

module.exports = function(Parent) {
  var TemplateConstructor = function() {};
  TemplateConstructor.prototype = Parent.prototype;
  return new Parent();
};

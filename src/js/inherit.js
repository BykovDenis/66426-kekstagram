'use strict';

module.exports = function(Parent) {
  var TemporaryConstructor = function() {};
  TemporaryConstructor.prototype = Parent.prototype;
  return new Parent();
};

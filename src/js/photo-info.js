'use strict';

var PhotoInfo = function(data) {
  this.data = data;
  this.liked = false;
};

/**
 * Метод для фиксирования лайка пользователем
 * @param {object} elem [description]
 */
PhotoInfo.prototype.setLikesCount = function(elem) {
  if(!this.liked) {
    this.data.likes++;
  } else {
    this.data.likes--;
  }
  elem.innerText = this.data.likes;
  this.liked = !this.liked;
};

module.exports = PhotoInfo;

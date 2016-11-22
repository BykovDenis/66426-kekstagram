'use strict';

var PhotoInfo = function() {
  this.pictureInfo = [];
};

PhotoInfo.prototype.subscribeEvents = function() {

  var setLikesCount = function() {
    if (!this.liked) {
      this.likes.textContent = parseInt(this.likes.textContent, 10) + 1;
    } else {
      this.likes.textContent = parseInt(this.likes.textContent, 10) - 1;
    }
    this.liked = !this.liked;
  };

  setLikesCount = setLikesCount.bind(this);

  this.likes.addEventListener('click', setLikesCount);

};

module.exports = PhotoInfo;

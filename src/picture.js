// Модуль отрисовки изображения
'use strict';

var gallery = require('./gallery');

var Picture = function(card, index, pictureCard) {

  // 10 время на загрузку картинки
  var IMAGE_LOAD_TIMEOUT = 10000;
  var IMG_SIDE = 182;

  this.data = {
    pictureCard: pictureCard,
    card: card,
    index: index,
  };

  // Создаем картинку
  this.data.img = new Image();
  var that = this;

  this.data.img.onload = function() {
    clearTimeout(timeOutLoading);
    var currentImg = that.data.pictureCard.querySelector('img');
    pictureCard.replaceChild(this, currentImg);

    that.remove();
  };

  var error = function() {
    pictureCard.classList.add('picture-load-failure');
  };

  var onclick = function(event) {
    event.preventDefault();
    gallery.show(index);
  };

  this.data.img.onerror = error;

  this.data.img.width = IMG_SIDE;
  this.data.img.height = IMG_SIDE;
  this.data.img.src = this.data.card.url;

  this.data.img.onclick = onclick;

  var timeOutLoading = setTimeout(error, IMAGE_LOAD_TIMEOUT);

  this.element = pictureCard;

};

Picture.prototype = {
  remove: function() {
    this.data.img.onload = null;
    this.data.img.error = null;
  },
};

module.exports = Picture;

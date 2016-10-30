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
  this.img = new Image();
  var that = this;

  this.img.onload = function() {
    clearTimeout(timeOutLoading);
    var currentImg = that.data.pictureCard.querySelector('img');
    pictureCard.replaceChild(this, currentImg);
  };

  var error = function() {
    pictureCard.classList.add('picture-load-failure');
  };

  var onclick = function(event) {
    event.preventDefault();
    gallery.show(index);
  };

  this.img.onerror = error;

  this.img.width = IMG_SIDE;
  this.img.height = IMG_SIDE;
  this.img.src = this.data.card.url;

  this.img.onclick = onclick;

  var timeOutLoading = setTimeout(error, IMAGE_LOAD_TIMEOUT);

  this.element = pictureCard;

};

Picture.prototype = {
  remove: function() {
    this.img.onclick = null;
  },
};

module.exports = Picture;

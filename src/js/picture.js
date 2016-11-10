// Модуль отрисовки изображения
'use strict';

var gallery = require('./gallery');

var Picture = function(card, index, element) {

  // 10 время на загрузку картинки
  var IMAGE_LOAD_TIMEOUT = 10000;
  var IMG_SIDE = 182;

  this.element = element;

  this.data = {
    card: card,
    index: index,
  };

  this.element.querySelector('.picture-likes').innerText = this.data.card.likes;
  this.element.querySelector('.picture-comments').innerText = this.data.card.comments;

  // Создаем картинку
  this.img = new Image();
  var that = this;

  this.img.onload = function() {
    clearTimeout(timeOutLoading);
    var currentImg = that.element.querySelector('img');
    that.element.replaceChild(this, currentImg);
  };

  var error = function() {
    that.element.classList.add('picture-load-failure');
  };

  var onclick = function(event) {
    //event.preventDefault();
    //gallery.show(index);
    window.location.hash = '#' + event.target.src.replace(document.location.origin+'/', '');
  };

  this.img.onerror = error;

  this.img.width = IMG_SIDE;
  this.img.height = IMG_SIDE;
  this.img.src = this.data.card.url;

  this.element.onclick = onclick;

  var timeOutLoading = setTimeout(error, IMAGE_LOAD_TIMEOUT);

};

Picture.prototype = {
  remove: function() {
    this.element.onclick = null;
  },
};

module.exports = Picture;

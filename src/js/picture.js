// Модуль отрисовки изображения
'use strict';

var inherit = require('./inherit');
var BaseComponent = require('./base-component');
var PhotoInfo = require('./photo-info');

var Picture = function(card, index, element) {

  // 10 время на загрузку картинки
  this.IMAGE_LOAD_TIMEOUT = 10000;
  this.IMG_SIDE = 182;

  this.element = element;

  this.data = {
    card: card,
    index: index,
  };

  this.pictureLike = this.element.querySelector('.picture-likes');
  this.pictureComments = this.element.querySelector('.picture-comments');
  this.pictureLike.innerText = this.data.card.likes;
  this.pictureComments.innerText = this.data.card.comments;

  // Создаем картинку
  this.img = new Image();

  this.img.onerror = this.error.bind(this);
  this.img.onload = this.load.bind(this);
  this.element.onclick = this.click.bind(this);
  this.img.width = this.IMG_SIDE;
  this.img.height = this.IMG_SIDE;
<<<<<<< HEAD
  this.img.src = this.data.card.url;
=======
  this.photoInfo = new PhotoInfo(this.data.card);
>>>>>>> module8-task4-alternative

  this.timeOutLoading = setTimeout(this.error.bind(this), this.IMAGE_LOAD_TIMEOUT);
};

Picture.prototype = inherit(BaseComponent);

Picture.prototype.remove = function() {
  this.element.onclick = null;
};

Picture.prototype.click = function(event) {
  var elem = event.target;
  event.preventDefault();
<<<<<<< HEAD
  var element = event.target;
  if(element.tagName === 'IMG') {
    window.location.hash = '#photo/' + element.src.replace(document.location.origin + '/', '');
=======
  if(elem.tagName === 'IMG') {
    window.location.hash = '#photo/' + elem.src.replace(document.location.origin + '/', '');
  }
  if (elem.classList.contains('picture-likes')) {
    this.photoInfo.setLikesCount(this.pictureLike);
>>>>>>> module8-task4-alternative
  }
};

Picture.prototype.error = function() {
  this.loadingError(this.element);
};

Picture.prototype.load = function() {
  clearTimeout(this.timeOutLoading);
  var currentImg = this.element.querySelector('img');
  this.element.replaceChild(this.img, currentImg);
};

module.exports = Picture;

// Модуль отрисовки изображения
'use strict';

var gallery = require('./gallery');

var Picture = function(card, index, element) {

  // 10 время на загрузку картинки
  this.IMAGE_LOAD_TIMEOUT = 10000;
  this.IMG_SIDE = 182;

  this.element = element;

  this.data = {
    card: card,
    index: index,
  };

  this.element.querySelector('.picture-likes').innerText = this.data.card.likes;
  this.element.querySelector('.picture-comments').innerText = this.data.card.comments;

  // Создаем картинку
  this.img = new Image();

  this.img.onerror = this.error.bind(this);
  this.img.onload = this.load.bind(this);
  this.element.onclick = this.click.bind(this);
  this.img.width = this.IMG_SIDE;
  this.img.height = this.IMG_SIDE;
  this.img.src = this.data.card.url;

  this.timeOutLoading = setTimeout(this.error, this.IMAGE_LOAD_TIMEOUT);
  this.hashchange();
};

Picture.prototype.hashchange = function() {
  var galleryVisible = gallery.visible.bind(gallery);
  window.addEventListener('hashchange', galleryVisible);
};

Picture.prototype.remove = function() {
  this.element.onclick = null;
};

Picture.prototype.click = function(event) {
  event.preventDefault();
  //gallery.show(this.data.index);
  window.location.hash = '#photo/' + event.target.src.replace(document.location.origin + '/', '');
};

Picture.prototype.error = function() {
  if(this.element) {
    this.element.classList.add('picture-load-failure');
  }
};

Picture.prototype.load = function() {
  clearTimeout(this.timeOutLoading);
  var currentImg = this.element.querySelector('img');
  this.element.replaceChild(this.img, currentImg);
};

module.exports = Picture;

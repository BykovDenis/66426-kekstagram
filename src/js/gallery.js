'use strict';

var BaseComponent = require('./base-component');
var inherit = require('./inherit');

// Отвечает за отрисовку фотографий
var Gallery = function() {

  // Массив объектов для отображения
  this.pictures = [];
  // Номер текущей фотографии в галерее
  this.activePicture = -1;
  // Ссылки на DOM элементы
  this.element = document.querySelector('.gallery-overlay');
  this.elementClose = document.querySelector('.gallery-overlay-close');
  this.elementImage = document.querySelector('.gallery-overlay-image');

  this.visible = this.visible.bind(this);

  this.hashChange();

};

Gallery.prototype = inherit(BaseComponent);


Gallery.prototype.hashChange = function() {
  window.addEventListener('hashchange', this.visible);
};

Gallery.prototype.elementImageError = function() {
  this.loadingError(this.elementImage);
};

Gallery.prototype.elementImageLoad = function() {
  this.elementImage.classList.remove('picture-load-failure');
};

Gallery.prototype.setPictures = function(data) {
  this.pictures = data;
};

Gallery.prototype.getIndexPhotoByHash = function() {
  var res = 0;
  var url = window.location.hash.replace('#photo/', '');
  this.pictures.forEach(function(elem, index) {
    if (elem.url === url) {
      res = index;
    }
  });
  return res;
};

Gallery.prototype.visible = function() {

  var match = window.location.hash.match(/#photo\/(\S+)/ig);
  var photo = match ? match[0].replace('#photo/', '') : '';
  if(match) {
    this.element.classList.remove('invisible');
    if (this.activePicture < 0) {
      this.elementClose.onclick = this.hide.bind(this);
      this.elementImage.onclick = this.setActivePicture.bind(this);
      this.elementImage.onerror = this.elementImageError.bind(this);
      this.elementImage.onload = this.elementImageLoad.bind(this);
      this.activePicture = this.getIndexPhotoByHash();
    }
    this.changePhoto(photo);
  } else {
    this.element.classList.add('invisible');
  }
};

Gallery.prototype.hide = function() {
  if(window.location.hash) {
    window.location.hash = '';
    this.activePicture = -1;
  }
  this.elementClose.onclick = null;
  this.elementImage.onclick = null;
  this.elementImage.onerror = null;
};

Gallery.prototype.changePhoto = function(photo) {
  if ((parseInt(photo, 10)).toString() === photo) {
    this.elementImage.src = this.pictures[photo].url;
  } else {
    this.elementImage.src = photo.replace('#photo/', '');
  }

  document.querySelector('.likes-count').innerText = this.pictures[this.activePicture].likes;
  document.querySelector('.comments-count').innerText = this.pictures[this.activePicture].comments;
};

Gallery.prototype.setActivePicture = function() {
  this.activePicture++;
  if (this.activePicture >= this.pictures.length) {
    this.activePicture = 0;
  }
  window.location.hash = '#photo/' + this.pictures[this.activePicture].url.replace(document.location.origin + '/', '');
};

module.exports = new Gallery();

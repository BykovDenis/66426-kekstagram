'use strict';

var BaseComponent = require('./base-component');
var inherit = require('./inherit');
var PhotoInfo = require('./photo-info');

// Отвечает за отрисовку фотографий
var Gallery = function() {

  // Массив объектов для отображения
  this.pictures = [];
  // Номер текущей фотографии в галерее
  this.activePicture = -1;
  // Ссылки на DOM элементы
  this.elementOverlay = document.querySelector('.gallery-overlay');
  this.elementClose = document.querySelector('.gallery-overlay-close');
  this.element = document.querySelector('.gallery-overlay-image');
  this.likesCount = document.querySelector('.likes-count');
  this.visible = this.visible.bind(this);

  this.hashChange();

};

Gallery.prototype = inherit(BaseComponent);

Gallery.prototype.elementImageClick = function() {
  this.photoInfo.setLikesCount(this.likesCount);
};

Gallery.prototype.hashChange = function() {
  window.addEventListener('hashchange', this.visible);
};

Gallery.prototype.elementImageError = function() {
  this.loadingError(this.element);
};

Gallery.prototype.elementImageLoad = function() {
  this.element.classList.remove('picture-load-failure');
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
    this.elementOverlay.classList.remove('invisible');
    if (this.activePicture < 0) {
      this.elementClose.onclick = this.hide.bind(this);
      this.element.onclick = this.setActivePicture.bind(this);
      this.element.onerror = this.elementImageError.bind(this);
      this.element.onload = this.elementImageLoad.bind(this);
      this.likesCount.onclick = this.elementImageClick.bind(this);
      this.activePicture = this.getIndexPhotoByHash();
    }
    this.photoInfo = new PhotoInfo(this.pictures[this.activePicture]);
    this.changePhoto(photo);
  } else {
    this.elementOverlay.classList.add('invisible');
  }
};

Gallery.prototype.hide = function() {
  if(window.location.hash) {
    window.location.hash = '';
    this.activePicture = -1;
  }
  this.elementClose.onclick = null;
  this.element.onclick = null;
  this.element.onerror = null;
  this.likesCount.onclick = null;
};

Gallery.prototype.changePhoto = function(photo) {
  if ((parseInt(photo, 10)).toString() === photo) {
    this.element.src = this.pictures[photo].url;
  } else {
    this.element.src = photo.replace('#photo/', '');
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

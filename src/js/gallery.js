'use strict';

var BaseComponent = require('./base-component');
var inherit = require('./inherit');

// Отвечает за отрисовку фотографий
var Gallery = function() {

  // Массив объектов для отображения
  this.pictures = [];
  // Номер текущей фотографии в галерее
  this.activePicture = 0;
  // Ссылки на DOM элементы
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');

  this.galleryOverlayClose.onclick = this.hide.bind(this);
  this.galleryOverlayImage.onclick = this.setActivePicture.bind(this);
  this.galleryOverlayImage.onerror = this.galleryOverlayImageError.bind(this);
  this.galleryOverlayImage.onload = this.galleryOverlayImageLoad.bind(this);

};

Gallery.prototype = inherit(BaseComponent);

Gallery.prototype.imgSource = function(el, url) {
  BaseComponent.prototype.imgSource.call(this, el, url);
};

Gallery.prototype.galleryOverlayImageError = function() {
  this.galleryOverlayImage.classList.add('picture-load-failure');
};

Gallery.prototype.galleryOverlayImageLoad = function() {
  this.galleryOverlayImage.classList.remove('picture-load-failure');
};

Gallery.prototype.setPictures = function(data) {
  this.pictures = data;
};

Gallery.prototype.visible = function(index) {
  if (window.location.hash.replace(/#photo\/(\S+)/, '') !== window.location.hash) {
    this.galleryOverlay.classList.remove('invisible');
    this.changePhoto(index);
  } else {
    this.galleryOverlay.classList.add('invisible');
  }
};

Gallery.prototype.hide = function() {
  if(BaseComponent.prototype.clearURLHash()) {
    this.activePicture = 0;
  }
  this.galleryOverlayClose.onclick = null;
  this.galleryOverlayImage.onclick = null;
  this.galleryOverlayImage.onerror = null;
};

Gallery.prototype.getPhotoByHash = function() {
  var indexPhoto;
  this.pictures.map(function(elem, index) {
    if(window.location.hash.replace('#photo/', '') === elem.url) {
      indexPhoto = index;
      return indexPhoto;
    }
    return 0;
  });
  return indexPhoto;
};

Gallery.prototype.changePhoto = function(index) {
  if ((parseInt(index, 10)).toString() === index) {
    this.activePicture = index;
  } else {
    this.activePicture = this.getPhotoByHash();
  }

  this.imgSource(this.galleryOverlayImage, this.pictures[this.activePicture].url);

  document.querySelector('.likes-count').innerText = this.pictures[this.activePicture].likes;
  document.querySelector('.comments-count').innerText = this.pictures[this.activePicture].comments;
  this.activePicture++;
  if (this.activePicture >= this.pictures.length) {
    this.activePicture = 0;
  }
};

Gallery.prototype.setActivePicture = function() {
  window.location.hash = '#photo/' + this.pictures[this.activePicture].url.replace(document.location.origin + '/', '');
};

module.exports = new Gallery();

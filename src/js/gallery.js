'use strict';

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

Gallery.prototype.galleryOverlayImageError = function() {
  this.galleryOverlayImage.classList.add('picture-load-failure');
};

Gallery.prototype.galleryOverlayImageLoad = function() {
  this.galleryOverlayImage.classList.remove('picture-load-failure');
};

Gallery.prototype.setPictures = function(data) {
  this.pictures = data;
};

Gallery.prototype.show = function(index) {
  this.galleryOverlay.classList.remove('invisible');
  this.activePicture = index;
  this.setActivePicture();
};

Gallery.prototype.hide = function() {
  this.galleryOverlay.classList.add('invisible');
  this.galleryOverlayClose.onclick = null;
  this.galleryOverlayImage.onclick = null;
  this.galleryOverlayImage.onerror = null;
};

Gallery.prototype.setActivePicture = function() {

  if (this.activePicture >= this.pictures.length) {
    this.activePicture = 0;
  }

  this.galleryOverlayImage.src = this.pictures[this.activePicture].url;

  document.querySelector('.likes-count').innerText = this.pictures[this.activePicture].likes;
  document.querySelector('.comments-count').innerText = this.pictures[this.activePicture].comments;

  this.activePicture++;
};

module.exports = new Gallery();

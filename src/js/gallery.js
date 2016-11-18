'use strict';

// Отвечает за отрисовку фотографий
var Gallery = function() {

  // Массив объектов для отображения
  this.pictures = [];
  // Номер текущей фотографии в галерее
  this.activePicture = -1;
  // Ссылки на DOM элементы
  this.galleryOverlay = document.querySelector('.gallery-overlay');
  this.galleryOverlayClose = document.querySelector('.gallery-overlay-close');
  this.galleryOverlayImage = document.querySelector('.gallery-overlay-image');

  this.visible = this.visible.bind(this);

  this.hashChange();

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
    this.galleryOverlay.classList.remove('invisible');
    if (this.activePicture < 0) {
      this.activePicture = 0;
      this.galleryOverlayClose.onclick = this.hide.bind(this);
      this.galleryOverlayImage.onclick = this.setActivePicture.bind(this);
      this.galleryOverlayImage.onerror = this.galleryOverlayImageError.bind(this);
      this.galleryOverlayImage.onload = this.galleryOverlayImageLoad.bind(this);
      this.activePicture = this.getIndexPhotoByHash();
    }
    this.changePhoto(photo);
  } else {
    this.galleryOverlay.classList.add('invisible');
  }
};

Gallery.prototype.hide = function() {
  if(window.location.hash) {
    window.location.hash = '';
    this.activePicture = -1;
  }
  this.galleryOverlayClose.onclick = null;
  this.galleryOverlayImage.onclick = null;
  this.galleryOverlayImage.onerror = null;
};

Gallery.prototype.changePhoto = function(photo) {
  if ((parseInt(photo, 10)).toString() === photo) {
    this.galleryOverlayImage.src = this.pictures[photo].url;
  } else {
    this.galleryOverlayImage.src = photo.replace('#photo/', '');
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

Gallery.prototype.hashChange = function() {
  window.addEventListener('hashchange', this.visible);
};

module.exports = new Gallery();

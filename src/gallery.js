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

};

Gallery.prototype = {
  setPictures: function(data) {
    this.pictures = data;
  },
  show: function(index) {

    var that = this;

    this.galleryOverlayClose.onclick = function() {
      that.hide();
    };

    this.galleryOverlayImage.onclick = function() {
      that.setActivePicture(that.activePicture);
    };

    this.galleryOverlay.classList.remove('invisible');
    this.setActivePicture(index);

  },
  hide: function() {
    this.galleryOverlay.classList.add('invisible');

    this.galleryOverlayClose.onclick = null;
    this.galleryOverlayImage.onclick = null;
    this.galleryOverlayImage.onerror = null;

  },
  setActivePicture: function(index) {

    this.activePicture = index;
    if (this.activePicture >= this.pictures.length) {
      this.activePicture = 0;
    }

    var that = this;

    this.galleryOverlayImage.onerror = function() {
      that.galleryOverlayImage.classList.add('picture-load-failure');
    };

    this.galleryOverlayImage.onload = function() {
      that.galleryOverlayImage.classList.remove('picture-load-failure');
    };

    this.galleryOverlayImage.src = this.pictures[this.activePicture].url;

    document.querySelector('.likes-count').innerText = this.pictures[this.activePicture].likes;
    document.querySelector('.comments-count').innerText = this.pictures[this.activePicture].comments;

    this.activePicture++;

  }
};

module.exports = new Gallery();

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

  var that = this;

  this.galleryOverlayClose.onclick = function() {
    that.hide();
  };

  this.galleryOverlayImage.onclick = function(event) {
    if(++that.activePicture >= that.pictures.length) {
      that.activePicture = 0;
    }
    that.setActivePicture(that.activePicture);
  };

};

Gallery.prototype = {
  setPictures: function(data) {
    data.forEach(function(elem, index) {
      this.pictures[index] = elem;
    });
  },
  show: function(index) {

    if (this.galleryOverlay.classList.contains('invisible')) {
      this.galleryOverlay.classList.remove('invisible');
    }

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

    var that = this;

    var error = function() {
      that.galleryOverlayImage.classList.add('picture-load-failure');
    };

    this.galleryOverlayImage.onerror = error;
    this.galleryOverlayImage.src = this.pictures[index].url;

    document.querySelector('.likes-count').innerText = this.pictures[index].likes;
    document.querySelector('.comments-count').innerText = this.pictures[index].comments;
  }
};

module.exports = new Gallery();

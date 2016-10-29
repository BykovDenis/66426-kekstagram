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
    var that = this;
    data.forEach(function(elem, index) {
      that.pictures[index] = elem;
    });
  },
  show: function(index) {

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

    var that = this;

    this.galleryOverlayImage.onerror = function() {
      that.galleryOverlayImage.classList.add('picture-load-failure');
    };

    this.galleryOverlayImage.onload = function() {
      that.galleryOverlayImage.classList.remove('picture-load-failure');
    };

    this.galleryOverlayImage.src = this.pictures[index].url;

    document.querySelector('.likes-count').innerText = this.pictures[index].likes;
    document.querySelector('.comments-count').innerText = this.pictures[index].comments;
  }
};

module.exports = new Gallery();

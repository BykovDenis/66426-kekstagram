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

  this.galleryOverlayClose.onclick = function() {
    this.hide();
  };

};

Gallery.prototype = {
  setPictures: function(data) {
    data.forEach(function(elem, index) {
      this.pictures[index] = elem;
    });
  },
  show: function(index) {
/*
    this.galleryOverlay.onclick = function(event) {
      event.preventDefault();
      console.info('Наажата фотка из галлереи ' + event.target);
    };
*/
    if (this.galleryOverlayImage.classList.contains('invisible')) {
      this.galleryOverlayImage.classList.remove('invisible');
    }
    if (++index > this.pictures.length) {
      index = 0;
    }
    this.setActivePicture(index);
  },
  hide: function() {
    this.galleryOverlayImage.classList.add('invisible');
  },
  setActivePicture: function(index) {
    this.activePicture = index;
    this.galleryOverlay.src = this.pictures[index].src;
    document.querySelector('.likes-count').innerText = this.pictures[index].likes;
    document.querySelector('.comments-count').innerText = this.pictures[index].comments;
  }
};

module.exports = new Gallery();

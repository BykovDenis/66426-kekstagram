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
  visible: function(index) {

    var that = this;

    this.galleryOverlayImage.onclick = function() {
      that.setActivePicture(that.activePicture);
    };

    if (window.location.hash.replace(/#photo\/(\S+)/, '') !== window.location.hash) {
      this.galleryOverlay.classList.remove('invisible');
      this.setActivePicture(index);
    }
    else {
      this.hide();
    }

  },
  hide: function() {
    window.location.hash = '';
    //this.galleryOverlay.classList.add('invisible');

    this.galleryOverlayClose.onclick = null;
    this.galleryOverlayImage.onclick = null;
    this.galleryOverlayImage.onerror = null;

  },
  getPhotoByHash: function() {
    var indexPhoto;
    this.pictures.map(function(elem, index) {

      //String.prototype.match(RegExp):?Array<string>
      ///#photo\/(\S+)/
      if(window.location.hash.replace('#photo/', '') === elem.url) {
        indexPhoto = index;
        return indexPhoto;
      }
    });
    return indexPhoto;
  },
  setActivePicture: function(index) {

    if ((parseInt(index, 10)).toString() === index) {
      this.activePicture = index;
    }
    else {
      this.activePicture = this.getPhotoByHash();
    }

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

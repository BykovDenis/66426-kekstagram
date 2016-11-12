'use strict';

var GalleryOverlayImage = function(params) {
  // Ссылки на DOM элементы
  this.params = params;
};

GalleryOverlayImage.prototype.galleryOverlayImageError = function() {
  this.galleryOverlayImage.classList.add('picture-load-failure');
};

GalleryOverlayImage.prototype.galleryOverlayImageLoad = function() {
  this.galleryOverlayImage.classList.remove('picture-load-failure');
};

GalleryOverlayImage.prototype.setPictures = function(data) {
  this.pictures = data;
};

GalleryOverlayImage.prototype.show = function(index) {
  this.galleryOverlay.classList.remove('invisible');
  this.activePicture = index;
  this.setActivePicture();
};

GalleryOverlayImage.prototype.hide = function() {
  this.params.galleryOverlay.classList.add('invisible');
  this.galleryOverlayClose.onclick = null;
  this.galleryOverlayImage.onclick = null;
  this.galleryOverlayImage.onerror = null;
};

module.exports = GalleryOverlayImage;

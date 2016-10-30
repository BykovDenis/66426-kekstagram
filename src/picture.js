// Модуль отрисовки изображения
'use strict';

var gallery = require('./gallery');

module.exports = function(img, index, pictureCard, imgSide) {
  img.width = imgSide;
  img.height = imgSide;
  var currentImg = pictureCard.querySelector('img');
  pictureCard.replaceChild(img, currentImg);

  img.onclick = function(event) {
    event.preventDefault();
    gallery.show(index);
  };

};

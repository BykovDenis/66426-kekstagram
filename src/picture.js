// Модуль отрисовки изображения
'use strict';

module.exports = function(img, pictureCard, imgSide) {
  img.width = imgSide;
  img.height = imgSide;
  var currentImg = pictureCard.querySelector('img');
  pictureCard.replaceChild(img, currentImg);
};

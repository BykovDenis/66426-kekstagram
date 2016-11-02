'use strict';

var loadJSONData = require('./load');
var Picture = require('./picture');
var gallery = require('./gallery');

var renderGallery = function(pictures) {

  gallery.setPictures(pictures);

  // Ищем блок для вставки элементов с картинками
  var picturesContainer = document.querySelector('.pictures');
  // Ищем шаблон
  var template = document.querySelector('template');
  var templateContainer = 'content' in template ? template.content : template;

  // парсим JSON
  pictures.forEach(function(card, index) {

    // строим карточки с фото и информацией
    var pictureCard = templateContainer.querySelector('.picture').cloneNode(true);
    pictureCard.querySelector('.picture-likes').innerText = card.likes;
    pictureCard.querySelector('.picture-comments').innerText = card.comments;

    var objPicture = new Picture(card, index, pictureCard);
    picturesContainer.appendChild(objPicture.element);

  });

  // Отображаем фильтры
  filters.classList.remove('hidden');

};

  // Скрываем фильтры
var filters = document.querySelector('.filters');
filters.classList.add('hidden');

var url = 'api/pictures';
var params = {
  from: 0,
  to: 12,
  filter: '',
};
loadJSONData(url, params, renderGallery);

// Функция для определения позиции скроллинга
function isScrolling() {
  var footerElement = document.querySelector('footer');
  var footerPosition = footerElement.getBoundingClientRect();
  return footerPosition.top - window.innerHeight - 100 <= 0;
}

// Функция для подгрузки фото
function getScrolling() {
  if(isScrolling) {
    params.from = params.to;
    params.to += 12;
    loadJSONData(url, params, renderGallery);
  }
}

// Обработчик событий на скроллинг экрана
window.addEventListener('scroll', function() {
  var interval = setInterval(getScrolling, 100);

});
window.removeEventListener('scroll', getScrolling);

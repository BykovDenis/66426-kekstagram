'use strict';

var loadJSONData = require('./load');
var Picture = require('./picture');
var gallery = require('./gallery');
var filtersData = require('../../bin/data/filter');
var arrFilters = ['filter-popular', 'filter-new', 'filter-discussed'];

var THROTTLE_DELAY = 100;
var COUNT_PHOTO_BY_SCROLL = 12;

var renderGallery = function(data) {

  //фильтр изображений
  var pictures = filtersData(data, params.filter);
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
  gallery.visible();

};

// Скрываем фильтры
var filters = document.querySelector('.filters');

// Валидация выбранного фильтра
var validationFilter = function(filterID) {
  return arrFilters.some(function(elem) {
    return elem === filterID;
  });
};

// Смотрим есть ли в localStorage что-нибудь
var filterID = localStorage.getItem('filterID') || 'filter-popular';
if (validationFilter(filterID)) {
  filters.elements[filterID].checked = 'true';
}

var url = 'api/pictures';
var params = {
  from: 0,
  to: COUNT_PHOTO_BY_SCROLL,
  filter: filterID,
};
loadJSONData(url, params, renderGallery);


var footerElement = document.querySelector('footer');
// Функция для определения позиции скроллинга
function isScrolling() {
  var footerPosition = footerElement.getBoundingClientRect();
  return footerPosition.top - window.innerHeight - 100 <= 0;
}

var throttle = function(callback, timeout) {
  var curTime;
  return function() {
    if (!curTime) {
      curTime = Date.now();
    }
    if(Date.now() - curTime >= timeout) {
      callback();
      curTime = Date.now();
    }
  };
};

// Функция для подгрузки фото
function getScrolling() {
  if(isScrolling) {
    params.from = params.to;
    params.to += COUNT_PHOTO_BY_SCROLL;
    loadJSONData(url, params, renderGallery);
  }
}

var optimizedScroll = throttle(getScrolling, THROTTLE_DELAY);

// Обработчик событий на скроллинг экрана
window.addEventListener('scroll', optimizedScroll);
window.removeEventListener('scroll', optimizedScroll);

// Обработчик событий на скроллинг экрана
window.addEventListener('scroll', optimizedScroll);
window.removeEventListener('scroll', optimizedScroll);

// Обрабатываем фильтры
filters.addEventListener('click', function(event) {
  if(event.target.classList.contains('filters-radio')) {
    // Чистим данные
    params.from = 0;
    params.to = COUNT_PHOTO_BY_SCROLL;
    params.filter = event.target.id;
    // Записываем выбранный фильтр
    localStorage.setItem('filterID', event.target.id);
    document.querySelector('.pictures').innerHTML = '';
    loadJSONData(url, params, renderGallery);
  }

});


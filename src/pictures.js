'use strict';

// Загружаем переменную в память
var jsonFileData = [{
  'likes': 40,
  'comments': 12,
  'url': 'photos/1.jpg'
}, {
  'likes': 125,
  'comments': 49,
  'url': 'photos/2.jpg'
}, {
  'likes': 350,
  'comments': 20,
  'url': 'failed.jpg'
}, {
  'likes': 61,
  'comments': 0,
  'url': 'photos/4.jpg'
}, {
  'likes': 100,
  'comments': 18,
  'url': 'photos/5.jpg'
}, {
  'likes': 88,
  'comments': 56,
  'url': 'photos/6.jpg'
}, {
  'likes': 328,
  'comments': 24,
  'url': 'photos/7.jpg'
}, {
  'likes': 4,
  'comments': 31,
  'url': 'photos/8.jpg'
}, {
  'likes': 328,
  'comments': 58,
  'url': 'photos/9.jpg'
}, {
  'likes': 25,
  'comments': 65,
  'url': 'photos/10.jpg'
}, {
  'likes': 193,
  'comments': 31,
  'url': 'photos/11.jpg'
}, {
  'likes': 155,
  'comments': 7,
  'url': 'photos/12.jpg'
}, {
  'likes': 369,
  'comments': 26,
  'url': 'photos/13.jpg'
}, {
  'likes': 301,
  'comments': 42,
  'url': 'photos/14.jpg'
}, {
  'likes': 241,
  'comments': 27,
  'url': 'photos/15.jpg'
}, {
  'likes': 364,
  'comments': 2,
  'url': 'photos/16.jpg'
}, {
  'likes': 115,
  'comments': 21,
  'url': 'photos/17.jpg'
}, {
  'likes': 228,
  'comments': 29,
  'url': 'photos/18.jpg'
}, {
  'likes': 53,
  'comments': 26,
  'url': 'photos/19.jpg'
}, {
  'likes': 240,
  'comments': 46,
  'url': 'photos/20.jpg'
}, {
  'likes': 290,
  'comments': 69,
  'url': 'photos/21.jpg'
}, {
  'likes': 283,
  'comments': 33,
  'url': 'photos/22.jpg'
}, {
  'likes': 344,
  'comments': 65,
  'url': 'photos/23.jpg'
}, {
  'likes': 216,
  'comments': 27,
  'url': 'photos/24.jpg'
}, {
  'likes': 241,
  'comments': 36,
  'url': 'photos/25.jpg'
}, {
  'likes': 100,
  'comments': 11,
  'url': 'photos/26.mp4',
  'preview': 'photos/26.jpg'
}];


// 10 время на загрузку картинки
var IMAGE_LOAD_TIMEOUT = 10000;
var IMG_SIDE = 182;

// Скрываем фильтры
var filters = document.querySelector('.filters');
filters.classList.add('hidden');

// Ищем блок для вставки элементов с картинками
var pictures = document.querySelector('.pictures');
// Ищем шаблон
var template = document.querySelector('template');
var templateContainer = 'content' in template ? template.content : template;

// парсим JSON
jsonFileData.forEach(function(card) {

  // строим карточки с фото и информацией
  var pictureCard = templateContainer.querySelector('.picture').cloneNode(true);
  pictureCard.querySelector('.picture-likes').innerText = card.likes;
  pictureCard.querySelector('.picture-comments').innerText = card.comments;

  // Создаем картинку
  var img = new Image();
  pictures.appendChild(pictureCard);

  //Отрисовка картинок
  // Работа с загрузкой картинок

  img.onload = function() {
    clearTimeout(timeOutLoading);
    img.width = IMG_SIDE;
    img.height = IMG_SIDE;
    var currentImg = pictureCard.querySelector('img');
    pictureCard.replaceChild(img, currentImg);
  };

  var error = function() {
    pictureCard.classList.add('picture-load-failure');
  };

  img.onerror = error;

  img.src = card.url;

  var timeOutLoading = setTimeout(error, IMAGE_LOAD_TIMEOUT);

});

filters.classList.remove('hidden');

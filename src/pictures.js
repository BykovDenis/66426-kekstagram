'use strict';

// Загружаем переменную в память
var loadJSONData = function(url, callback) {

  var __callBackName = '__callBackName'; // 'cb' + Date.now();

  window.__callBackName = function(data) {
    callback(data);
  };

  var script = document.createElement('script');
  script.src = url + '?callback=' + __callBackName;
  document.body.appendChild(script);
};

var url = 'http://localhost:1507/api/pictures';

var renderGallery = function(pictures) {

  // 10 время на загрузку картинки
  var IMAGE_LOAD_TIMEOUT = 10000;
  var IMG_SIDE = 182;

  // Скрываем фильтры
  var filters = document.querySelector('.filters');
  filters.classList.add('hidden');

  // Ищем блок для вставки элементов с картинками
  var picturesContainer = document.querySelector('.pictures');
  // Ищем шаблон
  var template = document.querySelector('template');
  var templateContainer = 'content' in template ? template.content : template;

  // парсим JSON
  pictures.forEach(function(card) {

    // строим карточки с фото и информацией
    var pictureCard = templateContainer.querySelector('.picture').cloneNode(true);
    pictureCard.querySelector('.picture-likes').innerText = card.likes;
    pictureCard.querySelector('.picture-comments').innerText = card.comments;

    // Создаем картинку
    var img = new Image();
    picturesContainer.appendChild(pictureCard);

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

  // Отображаем фильтры
  filters.classList.remove('hidden');

};
loadJSONData(url, renderGallery);

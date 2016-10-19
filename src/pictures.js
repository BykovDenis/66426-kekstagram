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

// Скрываем фильтры
var filters = document.querySelectorAll('.filters');
filters.forEach(function(elem) {
  if (!elem.classList.contains('hidden')) {
    elem.classList.add('hidden');
  }
});

// Ищем блок для вставки элементов с картинками
var pictures = document.querySelector('.pictures');
// Ищем шаблон
var template = document.getElementById('picture-template');
var templateContainer = 'content' in template ? template.content : template;

// строим карточки с фото и информацией
var renderPictureCard = function(card) {
  var pictureCard = templateContainer.querySelector('.picture').cloneNode(true);
  pictureCard.querySelector('.picture-likes').innerText = card.likes;
  pictureCard.querySelector('.picture-comments').innerText = card.comments;

  // Создаем картинку
  var img = new Image();
  renderImage(img, card.url, pictureCard);

  pictures.appendChild(pictureCard);
};

//Отрисовка картинок
var renderImage = function(img, url, container) {
  // Работа с загрузкой картинок
  var IMAGE_LOAD_TIMEOUT = 10000; // 10 время на загрузку картинки
  var timeOutLoading = null;

  img.onload = function() {
    clearTimeout(timeOutLoading);
    img.width = 182;
    img.height = 182;
    // Ужасный костыль, но что поделать в задании картинку через new Image() делать надо, следовательно старую нужно куда-то задвинуть
    var innerImg = container.getElementsByTagName('img');
    container.appendChild(img);
    innerImg[0].parentNode.removeChild(innerImg[0]);
  };

  img.onerror = function() {
    if (!pictures.classList.contains('picture-load-failure')) {
      container.classList.add('picture-load-failure');
    }
  };

  img.src = url;

  timeOutLoading = setTimeout(function() {
    if (!container.classList.contains('picture-load-failure')) {
      container.classList.add('picture-load-failure');
    }
  }, IMAGE_LOAD_TIMEOUT);
};

// парсим JSON
jsonFileData.forEach(function(elem) {
  renderPictureCard(elem);
}, this);



















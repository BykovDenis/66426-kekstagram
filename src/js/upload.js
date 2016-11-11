/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  var cleanupResizer = function() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  };

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  var updateBackground = function() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  };

  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  var resizeFormIsValid = function() {
    return true;
  };

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  var showMessage = function(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  };

  var hideMessage = function() {
    uploadMessage.classList.add('invisible');
  };

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.addEventListener('change', function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.addEventListener('load', function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          window.resizer = currentResizer;

          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          resizeForm.classList.remove('invisible');

          movePhoto();
          hideMessage();
        });

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если формат загружаемого файла не поддерживается
        showMessage(Action.ERROR);
      }
    }
  });

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid()) {
      var image = currentResizer.exportImage().src;
      var thumbnails = filterForm.querySelectorAll('.upload-filter-preview');
      for (var i = 0; i < thumbnails.length; i++) {
        thumbnails[i].style.backgroundImage = 'url(' + image + ')';
      }

      filterImage.src = image;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    }
  });

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.addEventListener('reset', function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  });

  /**
   * Количество дней со дня рождения Грейс Хоппер
   * @return {number} [description]
   */
  var getDaysFromBirthdayGraceHopper = function() {
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var currentMonth = currentDate.getMonth();
    var currentNumberDayOfMonth = currentDate.getDate();
    var dayBirthdateGrace = 9;
    var monthBirthdayGrace = 0;
    // Если 9 число года значит ищем разницу в днях со дня рождения в текущем году
    var baseYear = (currentMonth === monthBirthdayGrace && currentNumberDayOfMonth < dayBirthdateGrace) ? currentYear - 1 : currentYear;
    var birthdate = new Date(baseYear, monthBirthdayGrace, dayBirthdateGrace);
    return Math.ceil((currentDate.valueOf() - birthdate.valueOf()) / (1000 * 60 * 60 * 24));
  };


  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.addEventListener('submit', function(evt) {
    evt.preventDefault();

    var filter = filterForm.getElementsByTagName('img')[0].className.replace('filter-image-preview ', '');
    if(filter) {
      var dayNumber = getDaysFromBirthdayGraceHopper() || 0;
      window.Cookies.set('upload-filter', filter, {expires: dayNumber});
    }

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  });

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.addEventListener('change', function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia',
        'marvin': 'filter-marvin'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  });

  var filter = window.Cookies.get('upload-filter');
  if(filter) {
    // Выбираем нужный компонент из кука
    var input = document.getElementById('upload-' + filter);
    if(input) {
      input.checked = true;
      // Применяем фильтр
      filterImage.className = 'filter-image-preview ' + filter;
    }
  }


  // Определяем форму для валидации
  var frmUploadResize = document.getElementById('upload-resize');
  //Определяем элементы формы
  // Определяем поля ввода для валидации на форме
  // Положение кадра слева
  var partLeft = frmUploadResize.elements.x;
  // Положение кадра слева
  var partTop = frmUploadResize.elements.y;
  //  Размер стороны квадрата который будет вырезан из изображения
  var sideSize = frmUploadResize.elements.size;
  // Кнопка отправки данных на сервер
  var sbmSend = frmUploadResize.elements.fwd;


  // Поля «сверху» и «слева» не могут быть отрицательными.
  partLeft.min = 0;
  partTop.min = 0;

  var widthImage;
  var heightImage;

  /**
   * Метод валидации элементов формы
   *
   */
  var validateForm = function(event) {

    if(currentResizer) {
    // Параметры исходного изображения
      widthImage = currentResizer._image.naturalWidth;
      heightImage = currentResizer._image.naturalHeight;
      var element = event.target;
      var containerWidth = resizer._container.width;
      var containerHeight = resizer._container.height;


      // Масштабирование рамки
      if (element.name === 'size') {
        resizer.setConstraint((containerWidth - parseInt(element.value, 10)) / 2,
          (containerHeight - parseInt(element.value, 10)) / 2, parseInt(element.value, 10));
      }
      if(element.name === 'x') {
        resizer.setConstraint(parseInt(element.value, 10));
        resizer.moveConstraint(parseInt(element.value, 10) - parseInt(partLeft.value, 10));
        //partLeft.value = parseInt(element.value, 10) || 0;
      }
      if(element.name === 'y') {
        resizer.setConstraint(parseInt(partLeft.value, 10), parseInt(element.value, 10));
        resizer.moveConstraint(parseInt(element.value, 10) - parseInt(partTop.value, 10));
        //partTop.value = parseInt(element.value, 10) || 0;
      }

      // Сумма значений полей «слева» и «сторона»
      var sizeTopLeft = (parseInt(partLeft.value, 10) + parseInt(partTop.value, 10));

      // Сумма значений полей «сверху» и «сторона»
      var sizeTopSide = (parseInt(partTop.value, 10) + parseInt(sideSize.value, 10));

      // Сумма значений полей «слева» и «сторона» не должна быть больше ширины исходного изображения.
      // Сумма значений полей «сверху» и «сторона» не должна быть больше высоты исходного изображения.
      if (sizeTopLeft > widthImage || sizeTopSide > heightImage) {
        sbmSend.disabled = true;
        if(sizeTopLeft > widthImage) {
          console.info('Сумма значений полей «слева» и «сторона» не должна быть больше ширины исходного изображения.');
        }
        if(sizeTopSide > heightImage) {
          console.info('Сумма значений полей «сверху» и «сторона» не должна быть больше высоты исходного изображения.');
        }
      } else {
        sbmSend.disabled = false;
      }

    }

    if (partLeft.validity.rangeUnderflow) {
      partLeft.setCustomValidity('Введенное значение меньше допустимого. Не должно быть меньше 0');
    }

    if (partTop.validity.rangeUnderflow) {
      partTop.setCustomValidity('Введенное значение меньше допустимого. Не должно быть меньше 0');
    }

  };

  validateForm();

  // Навешиваем события DOM level 2 на текстовые поля ввода
  partLeft.addEventListener('input', validateForm);
  partTop.addEventListener('input', validateForm);
  sideSize.addEventListener('input', validateForm);


  var movePhoto = function() {

    // Определяем форму для валидации
    if (!frmUploadResize) {
      return;
    }
    var square = resizer.getConstraint() || {};
    //Определяем элементы формы
    // Определяем поля ввода для валидации на форме
    // Положение кадра слева
    frmUploadResize.elements.x.value = parseInt(square.x, 10) || 0;
    // Положение кадра сверху
    frmUploadResize.elements.y.value = parseInt(square.y, 10) || 0;
    //  Размер стороны квадрата который будет вырезан из изображения
    frmUploadResize.elements.size.value = square.side;

  };

  // Обработчик на ресайз окна
  window.addEventListener('resizerchange', movePhoto);

  cleanupResizer();
  updateBackground();



})();

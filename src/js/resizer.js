'use strict';

(function() {

  /**
   * @constructor
   * @param {string} image
   */
  var Resizer = function(image) {
    // Изображение, с которым будет вестись работа.
    this._image = new Image();
    this._image.src = image;

    // Холст.
    this._container = document.createElement('canvas');
    this._ctx = this._container.getContext('2d');

    // Создаем холст только после загрузки изображения.
    this._image.onload = function() {
      // Размер холста равен размеру загруженного изображения. Это нужно
      // для удобства работы с координатами.
      this._container.width = this._image.naturalWidth;
      this._container.height = this._image.naturalHeight;

      /**
       * Предлагаемый размер кадра в виде коэффициента относительно меньшей
       * стороны изображения.
       * @const
       * @type {number}
       */
      var INITIAL_SIDE_RATIO = 0.75;

      // Размер меньшей стороны изображения.
      var side = Math.min(
          this._container.width * INITIAL_SIDE_RATIO,
          this._container.height * INITIAL_SIDE_RATIO);

      // Изначально предлагаемое кадрирование — часть по центру с размером в 3/4
      // от размера меньшей стороны.
      this._resizeConstraint = new Square(
          this._container.width / 2 - side / 2,
          this._container.height / 2 - side / 2,
          side);

      // Отрисовка изначального состояния канваса.
      this.setConstraint();
    }.bind(this);

    // Фиксирование контекста обработчиков.
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onDrag = this._onDrag.bind(this);
  };

  Resizer.prototype = {
    /**
     * Родительский элемент канваса.
     * @type {Element}
     * @private
     */
    _element: null,

    /**
     * Положение курсора в момент перетаскивания. От положения курсора
     * рассчитывается смещение на которое нужно переместить изображение
     * за каждую итерацию перетаскивания.
     * @type {Coordinate}
     * @private
     */
    _cursorPosition: null,

    /**
     * Объект, хранящий итоговое кадрирование: сторона квадрата и смещение
     * от верхнего левого угла исходного изображения.
     * @type {Square}
     * @private
     */
    _resizeConstraint: null,

    /**
     * Отрисовка круглый хточек
     * @param  {number} x      положение точки на оси X
     * @param  {number} y      положение точки на оси Y
     * @param  {number} radius радиус окружности
     * @return Отрисованная точка
     */
    drawLinePointers: function(x, y, radius) {
      this._ctx.beginPath();
      this._ctx.arc(x, y, radius, 0, Math.PI * 2, true);
      this._ctx.fill();
    },

    /**
     * Отрисовка точечной рамки
     * @param  {object} params параметры отрисовка
     * @return отрисованная вигура
     */
    drawBorderPointers: function(params) {
      this._ctx.fillStyle = params.color;
      this._ctx.lineWidth = params.lineWidth;
      var i = params.startInnerPos;
      while (i < params.length) {
        this.drawLinePointers(i, params.startInnerPos, params.radius);
        this.drawLinePointers(params.startInnerPos, i, params.radius);
        this.drawLinePointers(i, params.endInnerPos, params.radius);
        this.drawLinePointers(params.endInnerPos, i, params.radius);
        i += params.step;
      }
    },

    /**
     * Отрисовка зигзагов горизонтальных
     * @param  {[type]} x     положение точки на оси X
     * @param  {[type]} y     положение точки на оси Y
     * @param  {[type]} angle угол наклона
     * @param  {[type]} size  размер
     * @return                отрисованная фигура
     */
    drawLineZigZagHorizontal: function(x, y, angle, length, step) {
      this._ctx.beginPath();
      while(x < length) {
        if (!(x % 2)) {
          this._ctx.lineTo(x, y - angle * 0.5);
        } else {
          this._ctx.lineTo(x, y);
        }
        x += step;
      }
      this._ctx.stroke();
    },

    /**
     * Отрисовка зигзагов вертикальных
     * @param  {[type]} x     положение точки на оси X
     * @param  {[type]} y     положение точки на оси Y
     * @param  {[type]} angle угол наклона
     * @param  {[type]} size  размер
     * @return                отрисованная фигура
     */
    drawLineZigZagVertical: function(x, y, angle, length, step) {
      this._ctx.beginPath();
      while(y < length) {
        if (!(y % 2)) {
          this._ctx.lineTo(x - angle * 0.5, y);
        } else {
          this._ctx.lineTo(x, y);
        }
        y += step;
      }
      this._ctx.stroke();
    },

    /**
     * Отрисовка рамки из кривых
     * @param  {[type]} startPos начальное положение отрисовки по оси
     * @param  {[type]} endPos   конечное положение отрисовки по оси
     * @param  {[type]} angle    угол поворота зигзагов
     * @param  {[type]} length   длина оси
     * @param  {[type]} step     шаг-длина зигзага
     * @return                   отрисованная рамка
     */
    drawBorderZigZag: function(startPos, endPos, angle, length, step) {
      this._ctx.beginPath();
      var x = startPos;
      var y = startPos;
      var k = 1;
      while(x < length) {
        if (!(k % 2)) {
          this._ctx.lineTo(x, startPos - angle * 0.5);
        } else {
          this._ctx.lineTo(x, startPos);
        }
        x += step;
        k++;
      }
      this._ctx.lineTo(endPos, startPos);
      while(y < length - step) {
        if (!(k % 2)) {
          this._ctx.lineTo(endPos - angle * 0.5, y);
        } else {
          this._ctx.lineTo(endPos, y);
        }
        y += step;
        k++;
      }
      this._ctx.lineTo(endPos, endPos);
      while(x > startPos - step) {
        if (!(k % 2)) {
          this._ctx.lineTo(x, endPos - angle * 0.5);
        } else {
          this._ctx.lineTo(x, endPos);
        }
        x -= step;
        k++;
      }
      this._ctx.lineTo(startPos, endPos);
      while(y > startPos - step) {
        if (!(k % 2)) {
          this._ctx.lineTo(startPos - angle * 0.5, y);
        } else {
          this._ctx.lineTo(startPos, y);
        }
        y -= step;
        k++;
      }
      this._ctx.lineTo(startPos, startPos);
      this._ctx.stroke();
    },

    /**
     * Отрисовка канваса.
     */
    redraw: function() {
      // Очистка изображения.
      this._ctx.clearRect(0, 0, this._container.width, this._container.height);

      // Параметры линии.
      // NB! Такие параметры сохраняются на время всего процесса отрисовки
      // canvas'a поэтому важно вовремя поменять их, если нужно начать отрисовку
      // чего-либо с другой обводкой.

      // Сохранение состояния канваса.
      this._ctx.save();

      // Установка начальной точки системы координат в центр холста.
      this._ctx.translate(this._container.width / 2, this._container.height / 2);

      var displX = -(this._resizeConstraint.x + this._resizeConstraint.side / 2);
      var displY = -(this._resizeConstraint.y + this._resizeConstraint.side / 2);
      // Отрисовка изображения на холсте. Параметры задают изображение, которое
      // нужно отрисовать и координаты его верхнего левого угла.
      // Координаты задаются от центра холста.
      this._ctx.drawImage(this._image, displX, displY);

      var startOuterPosX = -this._container.width / 2;
      var startOuterPosY = -this._container.height / 2;
      var endOuterPosX = this._container.width / 2;
      var endOuterPosY = this._container.height / 2;
      var subSide = this._resizeConstraint.side / 2;
      var startInnerPos = -(subSide + this._ctx.lineWidth);
      var endInnerPos = subSide - this._ctx.lineWidth;
      //Рисование прямоугольника-контура точками
      //Радиус точек
      var radius = 5;
      var params = {
        radius: radius,
        step: 10,
        direction: 'horizontal',
        startInnerPos: startInnerPos + 2.5 * radius,
        endInnerPos: endInnerPos - radius,
        length: subSide,
      };

      this._ctx.strokeStyle = '#ffe753';
      this._ctx.lineWidth = 4;
      var angle = Math.ceil(Math.sqrt((Math.pow(params.step, 2)) * 2));
      this.drawBorderZigZag(params.startInnerPos, params.endInnerPos, angle, params.length, params.step);

      this._ctx.lineWidth = 0;
      this._ctx.strokeStyle = 'rgba(0,0,0,0)';
      this._ctx.fillStyle = 'rgba(0,0,0,0)';

      // Толщина линии.
      this._ctx.lineWidth = 5;

      this._ctx.strokeStyle = 'rgba(0,0,0,.8)';
      this._ctx.fillStyle = 'rgba(0,0,0,.8)';

      this._ctx.setLineDash([0, 0]);
      // Смещение первого штриха от начала линии.
      this._ctx.lineDashOffset = 0;

      this._ctx.beginPath();
      this._ctx.moveTo( startOuterPosX, startOuterPosY );
      this._ctx.lineTo( endOuterPosX, startOuterPosY );
      this._ctx.lineTo( endOuterPosX, endOuterPosY );
      this._ctx.lineTo( startOuterPosX, endOuterPosY );
      this._ctx.lineTo( startOuterPosX, startOuterPosY );
      this._ctx.moveTo( startInnerPos, startInnerPos );
      this._ctx.lineTo( endInnerPos, startInnerPos );
      this._ctx.lineTo( endInnerPos, endInnerPos );
      this._ctx.lineTo( startInnerPos, endInnerPos );
      this._ctx.lineTo( startInnerPos, startInnerPos );

      this._ctx.fill('evenodd');

      // Пишем текст
      this._ctx.fillStyle = '#FFFFFF';
      this._ctx.strokeStyle = '#FFFFFF';

      this._ctx.font = '14px Arial';
      var text = this._image.naturalWidth + ' x ' + this._image.naturalHeight;
      this._ctx.textAlign = 'center';
      this._ctx.fillText(text, 0, (startOuterPosY + startInnerPos) / 2);

      // Восстановление состояния канваса, которое было до вызова ctx.save
      // и последующего изменения системы координат. Нужно для того, чтобы
      // следующий кадр рисовался с привычной системой координат, где точка
      // 0 0 находится в левом верхнем углу холста, в противном случае
      // некорректно сработает даже очистка холста или нужно будет использовать
      // сложные рассчеты для координат прямоугольника, который нужно очистить.
      this._ctx.restore();
    },

    /**
     * Включение режима перемещения. Запоминается текущее положение курсора,
     * устанавливается флаг, разрешающий перемещение и добавляются обработчики,
     * позволяющие перерисовывать изображение по мере перетаскивания.
     * @param {number} x
     * @param {number} y
     * @private
     */
    _enterDragMode: function(x, y) {
      this._cursorPosition = new Coordinate(x, y);
      document.body.addEventListener('mousemove', this._onDrag);
      document.body.addEventListener('mouseup', this._onDragEnd);
    },

    /**
     * Выключение режима перемещения.
     * @private
     */
    _exitDragMode: function() {
      this._cursorPosition = null;
      document.body.removeEventListener('mousemove', this._onDrag);
      document.body.removeEventListener('mouseup', this._onDragEnd);
    },

    /**
     * Перемещение изображения относительно кадра.
     * @param {number} x
     * @param {number} y
     * @private
     */
    updatePosition: function(x, y) {
      this.moveConstraint(
          this._cursorPosition.x - x,
          this._cursorPosition.y - y);
      this._cursorPosition = new Coordinate(x, y);
    },

    /**
     * @param {MouseEvent} evt
     * @private
     */
    _onDragStart: function(evt) {
      this._enterDragMode(evt.clientX, evt.clientY);
    },

    /**
     * Обработчик окончания перетаскивания.
     * @private
     */
    _onDragEnd: function() {
      this._exitDragMode();
    },

    /**
     * Обработчик события перетаскивания.
     * @param {MouseEvent} evt
     * @private
     */
    _onDrag: function(evt) {
      this.updatePosition(evt.clientX, evt.clientY);
    },

    /**
     * Добавление элемента в DOM.
     * @param {Element} element
     */
    setElement: function(element) {
      if (this._element === element) {
        return;
      }

      this._element = element;
      this._element.insertBefore(this._container, this._element.firstChild);
      // Обработчики начала и конца перетаскивания.
      this._container.addEventListener('mousedown', this._onDragStart);
    },

    /**
     * Возвращает кадрирование элемента.
     * @return {Square}
     */
    getConstraint: function() {
      return this._resizeConstraint;
    },

    /**
     * Смещает кадрирование на значение указанное в параметрах.
     * @param {number} deltaX
     * @param {number} deltaY
     * @param {number} deltaSide
     */
    moveConstraint: function(deltaX, deltaY, deltaSide) {
      this.setConstraint(
          this._resizeConstraint.x + (deltaX || 0),
          this._resizeConstraint.y + (deltaY || 0),
          this._resizeConstraint.side + (deltaSide || 0));
    },

    /**
     * @param {number} x
     * @param {number} y
     * @param {number} side
     */
    setConstraint: function(x, y, side) {
      if (typeof x !== 'undefined') {
        this._resizeConstraint.x = x;
      }

      if (typeof y !== 'undefined') {
        this._resizeConstraint.y = y;
      }

      if (typeof side !== 'undefined') {
        this._resizeConstraint.side = side;
      }

      requestAnimationFrame(function() {
        this.redraw();
        var resizerChangeEvent = document.createEvent('CustomEvent');
        resizerChangeEvent.initEvent('resizerchange', false, false);
        window.dispatchEvent(resizerChangeEvent);
      }.bind(this));
    },

    /**
     * Удаление. Убирает контейнер из родительского элемента, убирает
     * все обработчики событий и убирает ссылки.
     */
    remove: function() {
      this._element.removeChild(this._container);

      this._container.removeEventListener('mousedown', this._onDragStart);
      this._container = null;
    },

    /**
     * Экспорт обрезанного изображения как HTMLImageElement и исходником
     * картинки в src в формате dataURL.
     * @return {Image}
     */
    exportImage: function() {
      // Создаем Image, с размерами, указанными при кадрировании.
      var imageToExport = new Image();

      // Создается новый canvas, по размерам совпадающий с кадрированным
      // изображением, в него добавляется изображение взятое из канваса
      // с измененными координатами и сохраняется в dataURL, с помощью метода
      // toDataURL. Полученный исходный код, записывается в src у ранее
      // созданного изображения.
      var temporaryCanvas = document.createElement('canvas');
      var temporaryCtx = temporaryCanvas.getContext('2d');
      temporaryCanvas.width = this._resizeConstraint.side;
      temporaryCanvas.height = this._resizeConstraint.side;
      temporaryCtx.drawImage(this._image,
          -this._resizeConstraint.x,
          -this._resizeConstraint.y);
      imageToExport.src = temporaryCanvas.toDataURL('image/png');

      return imageToExport;
    }
  };

  /**
   * Вспомогательный тип, описывающий квадрат.
   * @constructor
   * @param {number} x
   * @param {number} y
   * @param {number} side
   * @private
   */
  var Square = function(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
  };

  /**
   * Вспомогательный тип, описывающий координату.
   * @constructor
   * @param {number} x
   * @param {number} y
   * @private
   */
  var Coordinate = function(x, y) {
    this.x = x;
    this.y = y;
  };

  window.Resizer = Resizer;
})();

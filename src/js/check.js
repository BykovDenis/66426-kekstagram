"use strict";

var getMessage = function(a, b){
	if(typeof a === "boolean"){
		if(a){
			return  "Переданное GIF-изображение анимировано и содержит "+b+" кадров";
		}
		else{
			return "Переданное GIF-изображение не анимировано";
		}
	};
	if(typeof a === "number"){
		return "Переданное SVG-изображение содержит "+a+" объектов и "+(b * 4)+" атрибутов"
	}
	if(typeof a === "object"){

		if(typeof b === "object"){
			var artifactsSquare = 0;
			for(var i = 0, len = a.length; i < len; i++){
				artifactsSquare += a[i] * b[i];
			}
			return "Общая площадь артефактов сжатия: "+artifactsSquare+" пикселей";
		}

		var amountOfRedPoints = 0;
		for(var i=0,len=a.length;i < len;i++){
			amountOfRedPoints += a[i];
		}
		return "Количество красных точек во всех строчках изображения: "+amountOfRedPoints;
	}

	return "Переданы некорректные данные";

}

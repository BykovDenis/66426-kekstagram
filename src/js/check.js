var getMessage = function(a, b){
	if(typeof a === "boolean"){
		if(a){
			return b;
		}
		else{
			return "Переданное GIF-изображение не анимировано";
		}
	};
	if(typeof a === "number"){
		return "Переданное SVG-изображение содержит "+a+" объектов и "+(b * 4)+" атрибутов"
	}

}
//to translate and for movement
function translationLocal(matrix, i, j){
	glMatrix.mat4.translate(matrix, matrix, [-transLeft * i, 0, -transDown * i]);
	glMatrix.mat4.translate(matrix, matrix, [-transRight * i, 0, -transUp * i]);
	return matrix;
}

//to scale 
function scaleTranslate(matrix){
	glMatrix.mat4.scale(matrix, matrix, [scalex, scaley, scalez]);
	glMatrix.mat4.scale(matrix, matrix, [scaleX, scaleY, scaleZ]);

	return matrix;
}

//use just one time to show cube sphere and eye and bow differenty
function translateEachCube(matrix, i, j, k){
	glMatrix.mat4.translate(matrix, matrix, [i, j, k]);
	return matrix;
}

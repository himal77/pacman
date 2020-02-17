//vertex shader
var vertexShaderText=[
	'precision mediump float;',
	'attribute vec3 aVertexPosition;',
	'attribute vec3 aVertexNormal;',

	'varying vec3 vVertexPosition;',
	'varying vec3 vVertexNormal;',

	'uniform mat4 uWorldMatrix;',
	'uniform mat4 uViewMatrix;',
	'uniform mat4 uProjectionMatrix;',
		'void main(){', 
			'vVertexNormal = vec3(uWorldMatrix * vec4(aVertexNormal, 1.0));',
			'vVertexPosition = vec3(uWorldMatrix * vec4(aVertexPosition, 1.0));',
			'gl_Position =  uProjectionMatrix * uViewMatrix * uWorldMatrix * vec4(aVertexPosition, 1.0);',
	'}'
].join('\n');

//fragment shader
var fragmentShaderText = [
'precision mediump float;',

'varying vec3 vVertexPosition;',
'varying vec3 vVertexNormal;',

'uniform vec3 uLightPosition;',
'uniform vec3 uCameraPosition;',
'uniform mat4 uLightMatrix;',

'uniform float uPacman;',

'void main(){',

			
			//normalizing normals value taken from vertex shader, when rotating light matrix is use for light transfromation
			'vec3 nVertexNormal = normalize(vVertexNormal);',
			'vec3 wLightPosition = vec3(uLightMatrix * vec4(uLightPosition, 1));',

			//normalizing light to vertex and vertex to eye/camera
			'vec3 nLightToVertex = normalize(vVertexPosition - wLightPosition);',
			'vec3 nCameraToVertex = normalize(vVertexPosition - uCameraPosition);',

			//if light falls on surface, then calculating how much
			'float lightIntensity = dot(-nLightToVertex, nVertexNormal);',
			'float specularIntensity = 0.0;',

			'vec3 diffuseColor = vec3(0.07, 0.12, 0.83);',
			'vec3 ambientColor = vec3(0.07, 0.12, 0.83);',

			'if(lightIntensity > 0.0){',
					'vec3 nReflectedRay = normalize(reflect(-nLightToVertex, nVertexNormal));',
					'specularIntensity = pow(dot(nReflectedRay, nCameraToVertex), 300.0);',
				'}',

				
				'vec3 specularColor = vec3(0.80, 0.81, 0.85);',
				'if(uPacman == 1.0){',
					'gl_FragColor = vec4(0.56, 0.94, 0.01, 1.0);',
				'}else{',
					'gl_FragColor = vec4(ambientColor + diffuseColor * lightIntensity + specularColor * specularIntensity, 1.0);',
				'}',
'}'
].join('\n');

//keys values
var eatS = new Audio('eat.wav');
var introS = new Audio('start.wav');
var winS = new Audio('win.wav');
var point;

var transLeft, transRight, transUp, transDown;

var openMouth, mouthSize, closeMouth;
var pacmanDirection;
var moveLeft, moveRight, moveUp, moveDown;
var moveICount, moveJCount;
var pacmanPosI;
var pacmanPosJ;
var foodCount;
var jumpPacman;
var jumpPacmanValue;
var height, jump, totalHeight; 


var mazeSize;
var localMatrixOfEachCube;
var matrixForSphere1;
var matrixForSphere2;
var matrixForEye1;
var matrixForEye2;
var matrixForBow;
var maze;

var program;
var gl;

//program starts here
var init = function(){

	console.log("WebGL is on its way baby");


	var canvas = document.getElementById('HCanvas');
	gl = canvas.getContext('webgl');

	if(!gl){moveRightCount += transRight;
		alert("WebGL not supported!");
		return;
	}
	
	//************* CREATE SHADER COMPILE AND LINK IN PROGRAM ************//

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	
	if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
		console.log("vertexShader compiled error" + gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);

	if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
		console.log('fragmentShader compile error' + gl.getShaderInfoLog(fragmentShader));
		return;
	}

	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);

	gl.linkProgram(program);
		if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
				console.log('Error linking program' + gl.getProgramInfoLog(program));
		}
	
	gl.validateProgram(program);
		if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
			console.log('Error validating program' + gl.getProgramInfoLog(program));
		}

	//******************* linking and compileing program finish ******************************//
	
	//using program to set uniform value down
	gl.useProgram(program);

	valueInitialization();
	
	var unifromProjectionMatrix = gl.getUniformLocation(program, 'uProjectionMatrix');
	var uniformViewMatrix = gl.getUniformLocation(program, 'uViewMatrix');
	var uniformLightPosition = gl.getUniformLocation(program, 'uLightPosition');
	var uniformCameraPosition = gl.getUniformLocation(program, 'uCameraPosition');
	var uniformLightMatrix = gl.getUniformLocation(program, 'uLightMatrix');

	var uniMatView = glMatrix.mat4.create();
	var uniMatProjection = glMatrix.mat4.create();

	var cameraPosition = [0, 20, -15];
	var lightPosition = [0, 10, 10];

	gl.uniform3fv(uniformLightPosition, lightPosition);
	gl.uniform3fv(uniformCameraPosition, cameraPosition);

	glMatrix.mat4.lookAt(uniMatView, cameraPosition, [0, 0, 0], [0, 2, 0]);    //view matrix
	gl.uniformMatrix4fv(uniformViewMatrix, gl.false, uniMatView);

	glMatrix.mat4.perspective(uniMatProjection, glMatrix.glMatrix.toRadian(40), canvas.width / canvas.height, 0.1, 500.0); //projection matrix
	gl.uniformMatrix4fv(unifromProjectionMatrix, gl.false, uniMatProjection);

	//***************Main Render Loop**************//

	gl.clear(gl.COLOUR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);	


	var lightPosMatrix = glMatrix.mat4.create();
		
	loop = function(){
		window.addEventListener("keydown", checkDownKey, false);

		gl.enable(gl.DEPTH_TEST);
		gl.enable(gl.CULL_FACE);

		gl.uniformMatrix4fv(uniformLightMatrix, false ,lightPosMatrix);

		for(i = 0; i < mazeSize; i++){	
				for(j = 0; j < mazeSize; j++){
					if(transLeft != 0 || transRight != 0 || transUp != 0 || transDown != 0){
						if(maze[i][j] == "f"){
							translationLocal(localMatrixOfEachCube[i][j], 5, 5);
						}else {
							translationLocal(localMatrixOfEachCube[i][j], 1.09, 1);
						}
					}
				drawCube(gl, program, localMatrixOfEachCube[i][j], maze[i][j]);	
			}
		}
		

		pacman(gl, program);
		
		animationId = requestAnimationFrame(loop);	
	}
	loop();
	
};	


function valueInitialization(){
maze = [
['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w'],
['w', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'w'],
['w', 'f', 'w', 'w', 'w', 'f', 'w', 'w', 'w', 'w'],
['w', 'f', 'f', 'f', 'w', 'f', 'w', 'f', 'f', 'w'],
['w', 'f', 'w', 'w', 'e', 'f', 'f', 'f', 'f', 'w'],
['w', 'f', 'f', 'w', 'e', 'w', 'f', 'f', 'f', 'w'],
['w', 'w', 'f', 'f', 'w', 'f', 'f', 'w', 'w', 'w'],
['w', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'f', 'w'],
['w', 'f', 'f', 'f', 'f', 'w', 'f', 'w', 'f', 'w'],
['w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w', 'w']

];

point = 0;

transLeft = 0, transRight = 0, transUp = 0, transDown = 0;

openMouth = 0, mouthSize = 0, closeMouth = 0;
pacmanDirection = "left";
moveLeft = false, moveRight = false, moveUp = false, moveDown = false;

pacmanPosI = 4;
pacmanPosJ = 4;
moveICount = 2.5 * pacmanPosI, moveJCount = 2.5 * pacmanPosJ;
foodCount = 0;
jumpPacman = false;
jumpPacmanValue = 0;
height = 90, jump = 1, totalHeight = 0; 

 mazeSize = 10;
 localMatrixOfEachCube = new Array(mazeSize);
	 matrixForSphere1 = glMatrix.mat4.create();
	 matrixForSphere2 = glMatrix.mat4.create();
	 matrixForEye1 = glMatrix.mat4.create();
	 matrixForEye2 = glMatrix.mat4.create();
	 matrixForBow = glMatrix.mat4.create();

	for(i = 0; i < mazeSize; i++){
		for(j = 0; j < mazeSize; j++){
			if(maze[i][j] == "f"){
				foodCount++;
			}
		}
	}

	localMatrixOfEachCube = new Array(mazeSize);

	//adjusting the two half sphere to make pacman
	translateEachCube(matrixForSphere1, 2.5, 0, 2.5);
	translateEachCube(matrixForSphere2, 2.5, -0.1, 2.5);
	glMatrix.mat4.scale(matrixForSphere1, matrixForSphere1, [0.5, 0.5, 0.5]);
	glMatrix.mat4.scale(matrixForSphere2, matrixForSphere2, [0.5, 0.5, 0.5]);
	glMatrix.mat4.rotateX(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(-45));
	glMatrix.mat4.rotateX(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(-45));
	glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(-85.5));
	glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(-85.5));
	glMatrix.mat4.rotateY(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(-180));
	
	translateEachCube(matrixForEye1, -1.0, -0.6, 1.1);
	glMatrix.mat4.scale(matrixForEye1, matrixForEye1, [0.2, 0.2, 0.2]);
		
	translateEachCube(matrixForEye2, -1.0, 0.6, 1.1);
	glMatrix.mat4.scale(matrixForEye2, matrixForEye2, [0.2, 0.2, 0.2]);

	translateEachCube(matrixForBow, 1.6, -1.0, 0.3);


	
	for(var i = 0; i < mazeSize; i++){
		localMatrixOfEachCube[i] = new Array(mazeSize);
	}
	

	for(i = -mazeSize / 2; i < mazeSize / 2; i++){
		for(j = -mazeSize / 2; j < mazeSize / 2; j++){
			localMatrixOfEachCube[i + mazeSize / 2][j + mazeSize / 2] = glMatrix.mat4.create();
			localMatrixOfEachCube[i + mazeSize / 2][j + mazeSize / 2] = translateEachCube(localMatrixOfEachCube[i + mazeSize / 2][j + mazeSize / 2], -j * 2.5, 0 , -i * 2.5);
			if(maze[i + mazeSize / 2][j + mazeSize / 2] == 'f'){
					glMatrix.mat4.scale(localMatrixOfEachCube[i + mazeSize / 2][j + mazeSize / 2], localMatrixOfEachCube[i + mazeSize / 2][j + mazeSize / 2], [0.2, 0.2, 0.2]);
			}
		}
	}
}








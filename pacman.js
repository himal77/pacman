//most of the things here is according to the privious lab 1a and 1b, but i created only this file an extra.
//i have done the foundation, gaming aspects and additional with sound and counting points.
//while doing the jumping test, be careful to jump near the food otherwise it may be hard to  see, 
//that pacman skips the food during jump
 

function pacman(gl, program){

		sphereVertices(gl, program, matrixForSphere1, 1, 1.0);
		sphereVertices(gl, program, matrixForSphere2, 1, 1.0);
		
		pacmanMovement();

		//for eye and bow movement with head of pacman
		glMatrix.mat4.multiply(matrixForEye1, matrixForSphere2, matrixForEye1);
		glMatrix.mat4.multiply(matrixForEye2, matrixForSphere2, matrixForEye2);
		glMatrix.mat4.multiply(matrixForBow, matrixForSphere2, matrixForBow);

		sphereVertices(gl, program, matrixForEye1, 2, 2);
		sphereVertices(gl, program, matrixForEye2, 2, 2);
		bow(gl, program, matrixForBow);

		matrixForEye1 = glMatrix.mat4.create();
		translateEachCube(matrixForEye1, -1.0, 0.6, 1.1);
		glMatrix.mat4.scale(matrixForEye1, matrixForEye1, [0.2, 0.2, 0.2]);

		matrixForEye2 = glMatrix.mat4.create();
		translateEachCube(matrixForEye2, 1.0, 0.6, 1.1);
		glMatrix.mat4.scale(matrixForEye2, matrixForEye2, [0.2, 0.2, 0.2]);	

		matrixForBow = glMatrix.mat4.create();
		translateEachCube(matrixForBow, 0.0, 1.0, 1.1);
		glMatrix.mat4.scale(matrixForBow, matrixForBow, [1.3, 1.3, 1.3]);
		glMatrix.mat4.rotateX(matrixForBow, matrixForBow, glMatrix.glMatrix.toRadian(45));
}

function pacmanMovement(){

	wallBlock();

	if(maze[pacmanPosI][pacmanPosJ] == "f" && matrixForSphere1[13] == 0){
		point += 1;
		document.getElementById("demo").innerHTML = point;
		maze[pacmanPosI][pacmanPosJ] = "e";
		eatS.play();
		foodCount--;
	}

	if(foodCount == 0){
document.getElementById("demo").innerHTML = "Winner winner chicken dinner";
		winS.play();
		cancelAnimationFrame(animationId);
		animationId = undefined;

		valueInitialization();
		
	}	

	if(maze[4][5] == "f"){
		introS.play();
	}

	if(jumpPacman == true){
		
			if(closeMouth != 0){
					glMatrix.mat4.rotateX(matrixForSphere2, matrixForSphere2, -closeMouth);
					closeMouth = 0;
					openMouth = 0;
					mouthSize = 0;
				}

						
			if(height  >= -90){
				translateEachCube(matrixForSphere1, 0.0, 0.0, -Math.sin(glMatrix.glMatrix.toRadian(height)));
				translateEachCube(matrixForSphere2, 0.0, 0.0,  Math.sin(glMatrix.glMatrix.toRadian(height)));
				height -= 5;
			}else if(height < -90){
				matrixForSphere1[13] = 0;
				matrixForSphere2[13] = -0.1;
				jumpPacman = false;
				height = 90;
			}

		}

			

	if(transLeft != 0 || transRight != 0 || transUp != 0 || transDown != 0){
		//this is used for opeaning and closing mouth
		if(mouthSize < 0.8){
			openMouth = 0.1;
			mouthSize += openMouth;
			closeMouth += openMouth;

		}else if(mouthSize >= 0.8){
				openMouth = -0.1;
				closeMouth -= 0.1;
				if(closeMouth <= 0){
					mouthSize = 0;
				}
			}

			glMatrix.mat4.rotateX(matrixForSphere2, matrixForSphere2, openMouth);

			
			//this is used to change the direction of pacman with the keyboard
			if(pacmanDirection != "down" && transDown != 0){
				if(closeMouth != 0){
					glMatrix.mat4.rotateX(matrixForSphere2, matrixForSphere2, -closeMouth);
					closeMouth = 0;
					openMouth = 0;
					mouthSize = 0;
				}
				
				if(pacmanDirection == "right"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(90));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(90));
					pacmanDirection = "down";
				} else if(pacmanDirection == "left"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(-90));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(-90));
					pacmanDirection = "down";
				}else if(pacmanDirection == "up"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(180));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(180));
					pacmanDirection = "down";
				}
			}else if(pacmanDirection != "up" && transUp != 0){
				if(closeMouth != 0){
					glMatrix.mat4.rotateX(matrixForSphere2, matrixForSphere2, -closeMouth);
					closeMouth = 0;
					openMouth = 0;
					mouthSize = 0;
				}
			
				if(pacmanDirection == "right"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(-90));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(-90));
					pacmanDirection = "up";
				} else if(pacmanDirection == "left"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(90));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(90));
					pacmanDirection = "up";
				}else if(pacmanDirection == "down"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(180));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(180));
					pacmanDirection = "up";
				}
			}else if(pacmanDirection != "right" && transRight != 0){
				if(closeMouth != 0){
					glMatrix.mat4.rotateX(matrixForSphere2, matrixForSphere2, -closeMouth);
					closeMouth = 0;
					openMouth = 0;
					mouthSize = 0;
				}
				
				if(pacmanDirection == "down"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(-90));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(-90));
					pacmanDirection = "right";
				} else if(pacmanDirection == "left"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(180));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(180));
					pacmanDirection = "right";
				}else if(pacmanDirection == "up"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(90));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(90));
					pacmanDirection = "right";
				}
			}	else if(pacmanDirection != "left" && transLeft != 0){
				if(closeMouth != 0){
					glMatrix.mat4.rotateX(matrixForSphere2, matrixForSphere2, -closeMouth);
					closeMouth = 0;
					openMouth = 0;
					mouthSize = 0;
				}
			
				if(pacmanDirection == "right"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(180));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(180));
					pacmanDirection = "left";
				} else if(pacmanDirection == "down"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(90));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(90));
					pacmanDirection = "left";
				}else if(pacmanDirection == "up"){
					glMatrix.mat4.rotateZ(matrixForSphere1, matrixForSphere1, glMatrix.glMatrix.toRadian(-90));
					glMatrix.mat4.rotateZ(matrixForSphere2, matrixForSphere2, glMatrix.glMatrix.toRadian(-90));
					pacmanDirection = "left";
				}
			}	
			
	}
}

//this function is used for blocking wall
function wallBlock(){

	moveICount -= transUp;
	moveICount -= transDown;
	moveJCount -= transLeft;
	moveJCount -= transRight;

	
	pacmanPosJ  = Math.round(moveJCount/2.51);		
	pacmanPosI = Math.round(moveICount/2.51);


	moveRight = moveLeft = moveDown = moveUp = true;

	if(pacmanDirection == "right"){
		if(maze[pacmanPosI][pacmanPosJ+1] == 'w' && moveJCount % 2.5 > 2){
			moveRight = false;
		}

		if(maze[pacmanPosI][pacmanPosJ-1] == 'w'){
			moveLeft = false;
		}

		if(maze[pacmanPosI+1][pacmanPosJ] == "w"){
			moveDown = false;
		}
	

		if(maze[pacmanPosI-1][pacmanPosJ] == 'w'){
			moveUp = false;
		}
	
		
		
	}else if(pacmanDirection == "left"){
		if(maze[pacmanPosI][pacmanPosJ-1] == 'w' && moveJCount % 2.5 > 2){
			moveLeft = false;
		}

		if(maze[pacmanPosI][pacmanPosJ+1] == 'w'){
			moveRight = false;
		}

		if(maze[pacmanPosI+1][pacmanPosJ] == "w"){
			moveDown = false;
		}
	

		if(maze[pacmanPosI-1][pacmanPosJ] == 'w'){
			moveUp = false;
		}
	

	}else if(pacmanDirection == "up"){
		if(maze[pacmanPosI-1][pacmanPosJ] == 'w'&& moveICount % 2.5 > 2){
			moveUp = false;
		}

		if(maze[pacmanPosI+1][pacmanPosJ] == 'w'){
			moveDown = false;
		}

		if(maze[pacmanPosI][pacmanPosJ-1] == "w"){
			moveLeft = false;
		}
	

		if(maze[pacmanPosI][pacmanPosJ+1] == 'w'){
			moveRight = false;
		}
	

	}else if(pacmanDirection == "down"){

		if(maze[pacmanPosI+1][pacmanPosJ] == 'w'&& moveICount % 2.5 > 2){
			moveDown = false;
		}

		if(maze[pacmanPosI-1][pacmanPosJ] == 'w'){
			moveUp = false;
		}

		if(maze[pacmanPosI][pacmanPosJ-1] == "w"){
			moveLeft = false;
		}
	

		if(maze[pacmanPosI][pacmanPosJ+1] == 'w'){
			moveRight = false;
		}
	
	}
			
	if(moveLeft == false){
		transLeft = 0;
	}
	if(moveRight == false){
		transRight = 0;
	}
	if(moveUp == false){
		transUp = 0;
	}
	if(moveDown == false){
		transDown = 0;
	}

	
}

 
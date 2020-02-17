//All the keyboard intraction are in this class

function checkDownKey(key){	
	downIntraction(key.keyCode);	
}


function downIntraction(pressedKey){
	switch(pressedKey){
		case 32: jumpPacman = true;
		     break;
		
		case 37: if(moveLeft == true){
					transRight = 0.0;
					transUp = 0.0;
					transDown = 0.0; 
					transLeft = 0.12;
				}		

			break;
		case 39: 
				if(moveRight == true){
					transRight = -0.12;
					transUp = 0.0;
					transDown = 0.0; 
					transLeft = 0.0;
				}
				 
			break;
		case 38: 
				if(moveUp == true){
					transRight = 0.0;
					transUp = 0.12;
					transDown = 0.0; 
					transLeft = 0.0;
				}	
			break;
		case 40:  
				if(moveDown == true){
					transRight = 0.0;
					transUp = 0.0;
					transDown = -0.12; 
					transLeft = 0.0;
				}
			break;
	}
}


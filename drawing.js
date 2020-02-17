
//function use to draw cube,
function drawCube(gl, program, localMatrix, element){
				var uniformWorldMatrix = gl.getUniformLocation(program, 'uWorldMatrix');
				gl.uniformMatrix4fv(uniformWorldMatrix, false, localMatrix);
				if(element == 'w'){		
					cubeVertices(gl, program, 0.7);	
					gl.uniformMatrix4fv(uniformWorldMatrix, false, localMatrix);
					gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
			   }else if(element == "f"){
			   		sphereVertices(gl, program, localMatrix,  2, 2);
			   }			
		}

//function used to draw cubes
function cubeVertices(gl, program, y){
	var boxVertices = 
	[           
		//vertex                  
		1.2 , -y, 1.2,   
		1.2 , -y, 1.2,    
		1.2 , y, 1.2,     
		-1.2 , y, 1.2,   
		
		-1.2 , -y, -1.2,   
		-1.2 , y, -1.2,  
		1.2 , y, -1.2,  
		1.2 , -y, -1.2,  
		
		-1.2 , y, -1.2,   
		-1.2 , y, 1.2,   
		1.2 , y, 1.2,  
		1.2 , y, -1.2,   

		-1.2 , -y, -1.2,    
		 1.2 , -y, -1.2,   
		1.2 , -y, 1.2, 
		-1.2 , -y, 1.2,   
		
		1.2 , -y, -1.2,    
		1.2 , y, -1.2,  
		1.2 , y, 1.2,  
		1.2 , -y, 1.2,   

		
		-1.2 , -y, -1.2,   
		-1.2 , -y, 1.2,    
		-1.2 , y, 1.2,    
		-1.2 , y, -1.2
	];

	var boxIndices =
	[
		0, 1, 2,
		0, 2, 3,	

		4, 5, 6,
		4, 6, 7,
		
		8, 9, 10,
		8, 10, 11,
		
		12, 13, 14,
		12, 14, 15,
		
		16, 17, 18,
		16, 18, 19,
		
		20, 21, 22,
		20, 22, 23
	];

	var normals = [
	0.0, 0.0, 1.0, 
	0.0, 0.0, 1.0,
	0.0, 0.0, 1.0, 
	0.0, 0.0, 1.0,

	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,
	1.0, 0.0, 0.0,

	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,
	0.0, 1.0, 0.0,

	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,
	-1.0, 0.0, 0.0,

	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,
	0.0, -1.0, 0.0,

	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0,
	0.0, 0.0, -1.0

];

	
	var boxVerticesBufferObject = gl.createBuffer(); //creating buffer
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVerticesBufferObject); //binding buffer
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW); //insert data from box vertices into bufferData

	//creating and binding buffer and inserting box indices
	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW); 

	//using attribute in vertex shader to give value
	var positionAttribLocation = gl.getAttribLocation(program, 'aVertexPosition');
	var normalAttribLocation = gl.getAttribLocation(program, 'aVertexNormal');
	var uniformPacman = gl.getUniformLocation(program, 'uPacman');
	gl.uniform1f(uniformPacman, 0.0);

	//way of taking data from buffer
	gl.vertexAttribPointer(	positionAttribLocation,	3,gl.FLOAT,	false, 0 * Float32Array.BYTES_PER_ELEMENT, 0);


	var normalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	
	gl.vertexAttribPointer(
		normalAttribLocation , //attribute location
		3,	//num of element per attribute
		gl.FLOAT, //type of element
		false, 
		0 * Float32Array.BYTES_PER_ELEMENT, //size of an individual vertex
		0 //offset from the begin of a single vertex of this attribute
	);
	//enabling attribute to pass value
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(normalAttribLocation);

}

//to draw sphere
function sphereVertices(gl, program, matrixForSphere, type, colorSelect){
	
	
	var r = 1.5;
	var horizentalLine = 10;
	var verticalLine = horizentalLine;
	
	var vertex = [];
	var normal = [];

	var horizentalNum = 0;
	while(horizentalNum <= horizentalLine){
      var hSin = Math.sin(horizentalNum * Math.PI / horizentalLine);
      var hCos = Math.cos(horizentalNum * Math.PI / horizentalLine);
      var verticalNum = 0;
      while( verticalNum <= verticalLine){
        var vSin = Math.sin(verticalNum * type * Math.PI / verticalLine);
        var vCos = Math.cos(verticalNum * type * Math.PI / verticalLine);
        var x = vCos * hSin;
        var y = hCos;
        var z = vSin * hSin;

  		normal.push(x);
        vertex.push(x * r);
 		
 		normal.push(y);
        vertex.push(y * r);
        
        normal.push(z);
        vertex.push(z * r);
 
        verticalNum++;
      }
      horizentalNum++;
    }
     var index = new Uint16Array(getPlaneIndices(r, horizentalLine, verticalLine));

     var positionAttribLocation = gl.getAttribLocation(program, 'aVertexPosition');
     var normalAttribLocation = gl.getAttribLocation(program, 'aVertexNormal');

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(normalAttribLocation);
	
	var verticesBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

	var indexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);

	gl.vertexAttribPointer(	positionAttribLocation,	3,gl.FLOAT,	false, 0 * Float32Array.BYTES_PER_ELEMENT, 0);

	var normalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
	
	gl.vertexAttribPointer(
		normalAttribLocation , //attribute location
		3,	//num of element per attribute
		gl.FLOAT, //type of element
		false, 
		0 * Float32Array.BYTES_PER_ELEMENT, //size of an individual vertex
		0 //offset from the begin of a single vertex of this attribute
	);

	var uniformWorldMatrix = gl.getUniformLocation(program, 'uWorldMatrix');
		gl.uniformMatrix4fv(uniformWorldMatrix, false, matrixForSphere);
	var uniformPacman = gl.getUniformLocation(program, 'uPacman');
		gl.uniform1f(uniformPacman, colorSelect);
	gl.drawElements(gl.TRIANGLES, index.length , gl.UNSIGNED_SHORT, 0);

}

function getPlaneIndices(r, horizentalLine, verticalLine){
	var index = [];

	var horizentalNum = 0;
	 while(horizentalNum < horizentalLine) {
	 	 var verticalNum = 0;
      while(verticalNum< verticalLine) {
        let f = (horizentalNum * (verticalLine + 1)) + verticalNum;
        let s = f + verticalLine + 1;
        index.push(f);
        index.push(s);
        index.push(f + 1);
        index.push(s);
        index.push(s + 1);
        index.push(f + 1);

        verticalNum++;
      }
      horizentalNum++;
    }
	return index;
}

//to draw bow
function bow(gl, program, matrixForBow){
	var vertex = [
		0, 0, 1,
		0, 0.94, -0.33,
		-0.81, -0.47, -0.33,
		0.81, -0.47, -0.33
	];

	var index = [
		0, 1, 2,
		1, 2, 3,
		0, 2, 1,
		0, 1, 3
	];

	var normal = [
		0.0, 0.0, 1.0, 
		0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 
		0.0, 0.0, 1.0
	];

	 var positionAttribLocation = gl.getAttribLocation(program, 'aVertexPosition');
     var normalAttribLocation = gl.getAttribLocation(program, 'aVertexNormal');

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(normalAttribLocation);
	
	var verticesBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, verticesBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

	var indexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);

	gl.vertexAttribPointer(	positionAttribLocation,	3,gl.FLOAT,	false, 0 * Float32Array.BYTES_PER_ELEMENT, 0);

	var normalBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normal), gl.STATIC_DRAW);
	
	gl.vertexAttribPointer(
		normalAttribLocation , //attribute location
		3,	//num of element per attribute
		gl.FLOAT, //type of element
		false, 
		0 * Float32Array.BYTES_PER_ELEMENT, //size of an individual vertex
		0 //offset from the begin of a single vertex of this attribute
	);

	var uniformWorldMatrix = gl.getUniformLocation(program, 'uWorldMatrix');
		gl.uniformMatrix4fv(uniformWorldMatrix, false, matrixForBow);
	var uniformPacman = gl.getUniformLocation(program, 'uPacman');
		gl.uniform1f(uniformPacman, 1);
	gl.drawElements(gl.TRIANGLES, index.length , gl.UNSIGNED_SHORT, 0);


}



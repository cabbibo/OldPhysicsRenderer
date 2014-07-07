
  /*

     Tendrils


    64 x 64

     64 / 4 = 16

     total number of tendrils = 64 * 4 = 256


  */
  function Tendrils(){

    this.size = 64;

    this.sim = shaders.simulationShaders.tendrilSim;

    this.flow = new THREE.Vector3();
    this.repelPoint = new THREE.Vector3();

    this.repelMesh = new THREE.Mesh(
        new THREE.IcosahedronGeometry(10),
        new THREE.MeshNormalMaterial()
    );
    
    this.repelMesh.position = this.repelPoint;

    scene.add( this.repelMesh );

    this.startingTexture = this.createStartingTexture();
    
    this.physicsRenderer = new PhysicsRenderer(
      this.size,
      this.sim,
      renderer
    );

    this.physicsRenderer.setUniform( 't_audio' , {
      type:"t",
      value:audioController.texture
    });

    this.physicsRenderer.setUniform( 't_og' , {
      type:"t",
      value:this.startingTexture
    });


    this.physicsRenderer.setUniform( 'flow' , {
      type:"v3",
      value:this.flow
    });


    this.physicsRenderer.setUniform( 'repelPoint' , {
      type:"v3",
      value:this.repelPoint
    });


    this.physicsRenderer.setUniform( 'repelRadius' , {
      type:"f",
      value:20
    });

    this.physicsRenderer.setUniform( 'dT'     , dT    );
    this.physicsRenderer.setUniform( 'timer'  , timer );

    var uniforms = {
      t_pos:{type:"t",value:null}
    }


    var materialLine = new THREE.ShaderMaterial({

      uniforms:uniforms,
      vertexShader: shaders.vertexShaders.tendrilLine,
      fragmentShader: shaders.fragmentShaders.tendrilLine,
      side:THREE.DoubleSide

    });

    var material = new THREE.ShaderMaterial({

      uniforms:uniforms,
      vertexShader: shaders.vertexShaders.tendril,
      fragmentShader: shaders.fragmentShaders.tendril,
      side:THREE.DoubleSide

    });



    console.log('BEGIN GEO CREATE');
    var geoLine = this.createLineGeo( this.size );
    var geo = this.createMeshGeo( this.size );

    this.line = new THREE.Line( geoLine , materialLine , THREE.LinePieces );
    this.mesh = new THREE.Mesh( geo , material );

    this.physicsRenderer.createDebugScene();
   // this.physicsRenderer.addDebugScene(scene);

    this.physicsRenderer.addBoundTexture( this.mesh , 't_pos' , 'output' );
    scene.add( this.line );
    scene.add( this.mesh );


    this.mesh.frustrumCulling = false;

    this.flowMarkerGeo = new THREE.Geometry();
    this.flowMarkerGeo.vertices.push( new THREE.Vector3() );
    this.flowMarkerGeo.vertices.push( this.flow );

    this.flowMarker = new THREE.Line( this.flowMarkerGeo , new THREE.LineBasicMaterial() );


    this.physicsRenderer.reset( this.startingTexture );

    scene.add( this.flowMarker );

  }


  Tendrils.prototype.update = function(){

    var r = 50 *  Math.abs( Math.cos( timer.value * .01 ) );

    var x = r * Math.cos( timer.value * 1);
    var y =0;// r * Math.sin( timer.value * 1);

   // console.log( x );

    this.flow.set( x , y , 0 );

    this.repelPoint.x = 20;
    this.repelPoint.y = 20;
    this.repelPoint.z = 20;

    this.repelPoint.x =( Math.sin( timer.value  ) + 1 ) * 20;
    this.repelPoint.y =( Math.cos( timer.value *.7 ) + 1 ) * 20;
    this.repelPoint.z =( Math.cos( timer.value * .9 ) + 2 ) * 20;
    //this.flowMarker.geometry.vertices[1] = this.flow;
    this.flowMarker.geometry.verticesNeedUpdate = true;

    this.physicsRenderer.update();

  }


  Tendrils.prototype.createLineGeo = function( size ){


    var geo = new THREE.BufferGeometry();

    geo.addAttribute( 'position', new Float32Array( 3840 * 2 * 3 ) , 3); 

    var positions = geo.getAttribute( 'position' ).array;


    var slices = 16;

    var TOTAL = 0;


    // Each column
    for( var j = 0; j < 4; j++ ){

      // Each row
      for( var i = 0; i < size; i++ ){

        var tendrilIndex = i + ( j * size );

         // Each part of tendril column
        for( var k = 0; k < slices-1; k++ ){

          
          // uv.x lookup into
          var x = i / size; 

          // uv.y lookup into pos
          var y = (j / 4 ) + (k / slices)/4;
          var yUp = (j / 4 ) + ((k+1) / slices)/4;


          
          var finalIndex = tendrilIndex * (slices-1);   
          finalIndex += k;

          finalIndex *= 3 * 2;

          positions[ finalIndex + 0  ] =  x;
          positions[ finalIndex + 1  ] =  y;
          positions[ finalIndex + 2  ] =  k;

          positions[ finalIndex + 3  ] =  x;
          positions[ finalIndex + 4  ] =  yUp;
          positions[ finalIndex + 5  ] =  k;

          TOTAL ++;


        }

      }

    }



    console.log( TOTAL );
    return geo;

  }

  Tendrils.prototype.createMeshGeo = function( size ){

    
    var geo = new THREE.BufferGeometry();

    geo.addAttribute( 'position', new Float32Array(412160   * 6 * 3 ) , 3); 

    geo.boundingBox =  { 
      min: new THREE.Vector3(100000 , 100000 , 100000 ), 
      max: new THREE.Vector3(-100000 , -100000 , -100000)
    }  

    geo.computeBoundingSphere();

    var positions = geo.getAttribute( 'position' ).array;


    var slices = 81 * 2;
    var sides   = 10;


  //  var totalNum = size * 4 * (slices-1) * (sides-1);
   
    var TOTAL = 0;

    // Each column
    for( var j = 0; j < 4; j++ ){
  
      // Each row
      for( var i = 0; i < size; i++ ){


        console.log('NEW TENDRIL')

        var tendrilIndex = i + ( j * size );

        // Each part of tendril column
        for( var k = 0; k < slices-1; k++ ){
           
          var sliceIndex = k;

          // uv.x lookup into
          var x = (i / size) + ((1/size)/2); 

          // uv.y lookup into pos
          var y = (j / 4 ) + (k / slices)/4;

          var yUp = (j/4) + ((k+1) / slices )/4;


          //y+= 1/( 4*2 *slices)
          //yUp+= 1/( 4*2 *slices)
          for( var l = 0; l < sides; l++ ){

            var sideIndex = l;

            // Position around column
            var z = l / sides;

            var zUp = ( l + 1 ) /sides;

            if( zUp == 1 ){
              zUp = 0;
            }

            if( zUp > 1 ){
              console.log( 'THIS IS TOTALLY FUCKED' );
            }

            var finalIndex = tendrilIndex * (slices-1)* (sides)* 6;   
            finalIndex += sliceIndex * (sides) * 6;
            finalIndex += sideIndex * 6;

            finalIndex *= 3;
            
            positions[ finalIndex + 0  ] =  x  ;
            positions[ finalIndex + 1  ] =  y  ;
            positions[ finalIndex + 2  ] =  z  ;
           
            positions[ finalIndex + 3  ] =  x  ;
            positions[ finalIndex + 4  ] =  y  ;
            positions[ finalIndex + 5  ] =  zUp;

            positions[ finalIndex + 6  ] =  x  ;
            positions[ finalIndex + 7  ] =  yUp;
            positions[ finalIndex + 8  ] =  zUp;

            positions[ finalIndex + 9  ] =  x  ;
            positions[ finalIndex + 10 ] =  y  ;
            positions[ finalIndex + 11 ] =  z  ;

            positions[ finalIndex + 12 ] =  x  ;
            positions[ finalIndex + 13 ] =  yUp;
            positions[ finalIndex + 14 ] =  zUp;
  
            positions[ finalIndex + 15 ] =  x  ;
            positions[ finalIndex + 16 ] =  yUp;
            positions[ finalIndex + 17 ] =  z  ;


            TOTAL += 1;

          }


        }


      }
  
    }

    console.log( TOTAL );

    return geo;

  }

  Tendrils.prototype.createStartingTexture = function(){

    var data = new Float32Array( this.size * this.size * 4 );

    for( var i = 0; i < this.size; i++ ) {

      for( var j = 0; j < this.size; j++ ){


        var preX = (i/this.size)* 16;
        var x = Math.floor(preX);
        var y = Math.floor((j/this.size)* 4);

        var slice = 1 - (((j/this.size) * 4) - y );
        
        y -= (preX - x );
        x /= 4;

        y = (4-y)-.875;
        x = x;

        z = slice;

        z *= 50;
        x *= 10;
        y *= 10;

        var index = ( i + (j * this.size)) * 4;

        data[ index + 0 ] = x;
        data[ index + 1 ] = y;
        data[ index + 2 ] = z;
        data[ index + 3 ] = 0;


      }


    }

    var positionsTexture = new THREE.DataTexture(
      data, 
      this.size, 
      this.size, 
      THREE.RGBAFormat, 
      THREE.FloatType 
    );

    positionsTexture.minFilter = THREE.NearestFilter;
    positionsTexture.magFilter = THREE.NearestFilter;
    positionsTexture.generateMipmaps = false;
    positionsTexture.needsUpdate = true;

    return positionsTexture;

  }

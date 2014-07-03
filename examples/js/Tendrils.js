
  /*

     Tendrils


    64 x 64

     64 / 4 = 16

     total number of tendrils = 64 * 4 = 256


  */
  function Tendrils(){

    this.size = 64;

    this.sim = shaders.simulationShaders.tendrilSim;

    this.physicsRenderer = new PhysicsRenderer(
      this.size,
      this.sim,
      renderer
    );

    this.physicsRenderer.setUniform( 't_audio' , {
      type:"t",
      value:audioController.texture
    });

    this.physicsRenderer.setUniform( 'dT'     , dT    );
    this.physicsRenderer.setUniform( 'timer'  , timer );

    var uniforms = {
      t_pos:{type:"t",value:null}
    }


    var material = new THREE.ShaderMaterial({

      uniforms:uniforms,
      vertexShader: shaders.vertexShaders.tendril,
      fragmentShader: shaders.fragmentShaders.tendril,
      side:THREE.DoubleSide

    });


    console.log('BEGIN GEO CREATE');
    var geo = this.createGeo( this.size );
    console.log('END GEO CREATE');

    this.mesh = new THREE.Mesh( geo , material );

    this.physicsRenderer.createDebugScene();
    this.physicsRenderer.addDebugScene(scene);

    this.physicsRenderer.addBoundTexture( this.mesh , 't_pos' , 'output' );


    scene.add( this.mesh );

  }


  Tendrils.prototype.update = function(){

    this.physicsRenderer.update();

  }

  Tendrils.prototype.createGeo = function( size ){

    
    var geo = new THREE.BufferGeometry();

    geo.addAttribute( 'position', new Float32Array( 38400 * 6 * 3 ) , 3); 

    var positions = geo.getAttribute( 'position' ).array;


    var slices = 16;
    var sides   = 10;


    var totalNum = size * 4 * (slices-1) * (sides-1);
   
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
          var x = i / size; 

          // uv.y lookup into pos
          var y = (j / 4 ) + (k / slices)/4;

          var yUp = (j/4) + ((k+1) / slices )/4;


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
            //console.log( finalIndex );


            /* Debugging */

            /*var centerPointX = (i + (j*size))*100;
            var centerPointY = 0;
            
            var theta   = (l / sides ) * 2 * Math.PI;
            var thetaUp = ((l+1)/sides ) * 2 * Math.PI;
            
            var x = centerPointX + 40*Math.cos( theta );
            var y = centerPointY + 40*Math.sin( theta );

            var xUp = centerPointX + 40*Math.cos( thetaUp );
            var yUp = centerPointY + 40*Math.sin( thetaUp );
          
            z = k * 100;
            zUp = (k+1) * 100;

            positions[ finalIndex + 0  ] =  x  ;
            positions[ finalIndex + 1  ] =  y  ;
            positions[ finalIndex + 2  ] =  z  ;
           
            positions[ finalIndex + 3  ] =  xUp;
            positions[ finalIndex + 4  ] =  yUp;
            positions[ finalIndex + 5  ] =  z;

            positions[ finalIndex + 6  ] =  xUp;
            positions[ finalIndex + 7  ] =  yUp;
            positions[ finalIndex + 8  ] =  zUp;

            positions[ finalIndex + 9  ] =  xUp;
            positions[ finalIndex + 10 ] =  yUp;
            positions[ finalIndex + 11 ] =  zUp;

            positions[ finalIndex + 12 ] =  x;
            positions[ finalIndex + 13 ] =  y;
            positions[ finalIndex + 14 ] =  zUp;
  
            positions[ finalIndex + 15 ] =  x;
            positions[ finalIndex + 16 ] =  y;
            positions[ finalIndex + 17 ] =  z;*/


           // console.log( finalIndex );

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

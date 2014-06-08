  

  var lineGeo = createLineGeo();

  function FurryTail( leader , lineGeo , uniformObject , sim , renderer ){

    this.size           = 32;
    this.sim            = sim;
    this.uniformObject  = uniformObject ;
    this.lineGeo        = lineGeo;
    this.leader         = leader; //|| new THREE.Object3D();
    this.position       = new THREE.Vector3();
    this.velocity       = new THREE.Vector3();  
    this.dampening      = Math.random() * .1 + 9.;
    //this.leader.position = this.position;
   
    this.id = Math.random();

    this.position.set(

        (Math.random() - .5 ) * 100,
        (Math.random() - .5 ) * 100,
        (Math.random() - .5 ) * 100

    );

    this.renderer     = renderer; 

    this.speed        = Math.random();
    this.radius        = (Math.random() + .5 ) * 50;
    this.physicsRenderer = new PhysicsRenderer( 
      this.size,
      this.sim,
      this.renderer 
    );

    var sprite = THREE.ImageUtils.loadTexture( '../img/cabbibo.png');


    var color1 = new THREE.Vector3( Math.random() , Math.random() , Math.random() );
    var color2 = new THREE.Vector3( Math.random() , Math.random() , Math.random() );
    var color3 = new THREE.Vector3( Math.random() , Math.random() , Math.random() );
    var color4 = new THREE.Vector3( Math.random() , Math.random() , Math.random() );
    
    this.particleUniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
      t_sprite:{ type:"t", value:sprite},
      t_audio:{ type:"t" , value:audioController.texture },
      color1: { type:"v3" , value:color1 },
      color2: { type:"v3" , value:color2 },
      color3: { type:"v3" , value:color3 },
      color4: { type:"v3" , value:color4 },

    }

    var mat = new THREE.ShaderMaterial({
      uniforms: this.particleUniforms,
      vertexShader: shaders.vertexShaders.render,
      fragmentShader: shaders.fragmentShaders.render,
      //blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    })

    var geo = ParticleUtils.createLookupGeometry( this.size );

    this.physicsParticles  = new THREE.ParticleSystem( geo , mat );

    var pR = this.physicsRenderer;
    
    pR.addBoundTexture( this.physicsParticles , 't_pos' , 'output' );
    pR.addBoundTexture( this.physicsParticles , 't_oPos' , 'oOutput' );
    pR.addBoundTexture( this.physicsParticles , 't_ooPos' , 'ooOutput' );


    this.lineUniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
      t_audio:{ type:"t" , value:audioController.texture },
      color1: { type:"v3" , value:color1 },
      color2: { type:"v3" , value:color2 },
      color3: { type:"v3" , value:color3 },
      color4: { type:"v3" , value:color4 },
    }


    var folder = gui.addFolder( 'COLOR' + Math.floor( this.id * 10000000 ) );

    var c ={ 
      spineColor: '#ff0000',
      subColor:   '#eeaa00',
      subSubColor:'#0000ff',
      bundleColor:'#999999' 
    }
  
      /*
     
       Color Params

    */

    folder.addColor( c , 'spineColor' ).onChange( function( value ){

      var col = new THREE.Color( value );
      console.log( col );

      this.particleUniforms.color1.value.x = col.r;
      this.particleUniforms.color1.value.y = col.g;
      this.particleUniforms.color1.value.z = col.b;
      
      this.lineUniforms.color1.value.x = col.r;
      this.lineUniforms.color1.value.y = col.g;
      this.lineUniforms.color1.value.z = col.b;
            
    }.bind( this ));

    folder.addColor( c , 'subColor' ).onChange( function( value ){

      var col = new THREE.Color( value );
      console.log( col );

      this.particleUniforms.color2.value.x = col.r;
      this.particleUniforms.color2.value.y = col.g;
      this.particleUniforms.color2.value.z = col.b;
      
      this.lineUniforms.color2.value.x = col.r;
      this.lineUniforms.color2.value.y = col.g;
      this.lineUniforms.color2.value.z = col.b;
            
    }.bind( this ));

    folder.addColor( c , 'subSubColor' ).onChange( function( value ){

      var col = new THREE.Color( value );
      console.log( col );

      this.particleUniforms.color3.value.x = col.r;
      this.particleUniforms.color3.value.y = col.g;
      this.particleUniforms.color3.value.z = col.b;
      
      this.lineUniforms.color3.value.x = col.r;
      this.lineUniforms.color3.value.y = col.g;
      this.lineUniforms.color3.value.z = col.b;
            
    }.bind( this ));
    folder.addColor( c , 'bundleColor' ).onChange( function( value ){

      var col = new THREE.Color( value );
      console.log( col );
      
      this.particleUniforms.color4.value.x = col.r;
      this.particleUniforms.color4.value.y = col.g;
      this.particleUniforms.color4.value.z = col.b;

      this.lineUniforms.color4.value.x = col.r;
      this.lineUniforms.color4.value.y = col.g;
      this.lineUniforms.color4.value.z = col.b;
            
    }.bind( this ));

    var lineMat = new THREE.ShaderMaterial({
      uniforms: this.lineUniforms,
      vertexShader: shaders.vertexShaders.lineRender,
      fragmentShader: shaders.fragmentShaders.lineRender,
      /*blending: THREE.AdditiveBlending,
      transparent: true,
      depthwrite: false*/
    
    });

    this.line = new THREE.Line( lineGeo , lineMat );
    this.line.type = THREE.LinePieces;
    
    pR.addBoundTexture( this.line , 't_pos' , 'output' );
    pR.addBoundTexture( this.line , 't_oPos' , 'oOutput' );
    pR.addBoundTexture( this.line , 't_ooPos' , 'ooOutput' );


    var mesh = new THREE.Mesh( new THREE.SphereGeometry( 5 ) );
    var pTexture = ParticleUtils.createPositionsTexture( this.size , mesh );
    this.physicsRenderer.reset( pTexture );
    this.applyUniforms();

  }


  FurryTail.prototype.setColors = function( color1 , color2 , color3 ){



  }


  FurryTail.prototype.addToScene = function(){

    scene.add( this.physicsParticles );
    scene.add( this.line );


  }

  FurryTail.prototype.update = function( force , audio){

   // console.log( audio );
    //console.log( this.velocity.x );
    this.velocity.add( force );
    
    var audioPower = ( audio * audio * audio)  + .3;
    this.position.add( this.velocity.clone().multiplyScalar( audioPower * .2 ) );
    //console.log( this.leader );
    this.leader.copy( this.position );
    this.velocity.multiplyScalar( .99 ); // turn to vector dampening

    this.physicsRenderer.update();

  }


  FurryTail.prototype.addDebugScene = function(){

    this.physicsRenderer.addDebugScene( scene );

  }


  FurryTail.prototype.applyUniforms = function(){

    var uO = this.uniformObject;

    for( var propt in uO ){
      this.physicsRenderer.setUniform( propt , uO[propt] );
    }


    this.physicsRenderer.setUniform( 't_audio' ,{
      type:"t",
      value: audioController.texture
    });

    this.physicsRenderer.setUniform( 'leader' , { 
      type:"v3" , 
      value: this.leader
    });


  }

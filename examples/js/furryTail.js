  

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

    var sprite = THREE.ImageUtils.loadTexture( '../img/flare.png');

    var uniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
      t_sprite:{ type:"t", value:sprite},
      t_audio:{ type:"t" , value:audioController.texture },
      color1: { type:"c" , value:new THREE.Color( 0xff0000 ) },
      color2: { type:"c" , value:new THREE.Color( 0xcccc55 ) },
      color3: { type:"c" , value:new THREE.Color( 0x0000ff ) },

    }

    var mat = new THREE.ShaderMaterial({
      uniforms: uniforms,
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


    var uniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
      t_audio:{ type:"t" , value:audioController.texture },
      color1: { type:"v3" , value:new THREE.Vector3(1 , 0 , 0) },
      color2: { type:"v3" , value:new THREE.Vector3( .9 , .5 , 0) },
      color3: { type:"v3" , value:new THREE.Vector3( 0,0,1) },
      color4: { type:"v3" , value:new THREE.Vector3( .5 , .5 , .5) },
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

    folder.add( c , 'spineColor' ).onFinishChange( function( value ){

      var col = new THREE.Color( value );
      console.log( col );

      this.color1.value.x = col.r;
      this.color1.value.y = col.g;
      this.color1.value.z = col.b;
            
    }.bind( uniforms ));

    folder.add( c , 'subColor' ).onFinishChange( function( value ){

      var col = new THREE.Color( value );
      console.log( col );

      this.color2.value.x = col.r;
      this.color2.value.y = col.g;
      this.color2.value.z = col.b;
            
    }.bind( uniforms ));
    folder.add( c , 'subSubColor' ).onFinishChange( function( value ){

      var col = new THREE.Color( value );
      console.log( col );

      this.color3.value.x = col.r;
      this.color3.value.y = col.g;
      this.color3.value.z = col.b;
            
    }.bind( uniforms ));
    folder.add( c , 'bundleColor' ).onFinishChange( function( value ){

      var col = new THREE.Color( value );
      console.log( col );

      this.color4.value.x = col.r;
      this.color4.value.y = col.g;
      this.color4.value.z = col.b;
            
    }.bind( uniforms ));

    var lineMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shaders.vertexShaders.lineRender,
      fragmentShader: shaders.fragmentShaders.lineRender,
     /* blending: THREE.AdditiveBlending,
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

    //scene.add( this.physicsParticles );
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

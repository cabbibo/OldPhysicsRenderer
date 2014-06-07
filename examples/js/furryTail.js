  
  function FurryTail( leader , lineGeo , uniformObject , sim , renderer ){

    this.size         = 32;
    this.sim          = sim;
    this.uniformObject = uniformObject ;
    this.lineGeo      = lineGeo;
    this.leader       = leader;
    this.renderer     = renderer; 

    this.speed        = Math.random();
    this.radius        = (Math.random() + .5 ) * 50;
    this.physicsRenderer = new PhysicsRenderer( 
      this.size,
      this.sim,
      this.renderer 
    );


    var uniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
    }

    var mat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shaders.vertexShaders.render,
      fragmentShader: shaders.fragmentShaders.render,
      /*blending: THREE.AdditiveBlending,
      transparent: true,
      depthwrite: false*/
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
      t_audio:{ type:"t" , value:t_audio },
    }

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


  FurryTail.prototype.addToScene = function(){

    //scene.add( this.physicsParticles );
    scene.add( this.line );


  }

  FurryTail.prototype.update = function(){

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


    this.physicsRenderer.setUniform( 'leader' , { 
      type:"v3" , 
      value: this.leader
    });


  }

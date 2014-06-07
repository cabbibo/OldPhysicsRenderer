  
  function FurryTail( leader , lineGeo , uniformObject , sim , renderer ){

    this.size         = 32;
    this.sim          = sim;
    this.uniformObject = uniformObject ;
    this.lineGeo      = lineGeo;
    this.leader       = leader;
    this.renderer     = renderer; 

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
      fragmentShader: shaders.fragmentShaders.render
    })

    var geo = ParticleUtils.createLookupGeometry( this.size );

    this.physicsParticles  = new THREE.ParticleSystem( geo , mat );

    var pR = this.physicsRenderer;
    
    pR.addBoundTexture( this.physicsParticles , 't_pos' , 'output' );
    pR.addBoundTexture( this.physicsParticles , 't_oPos' , 'oOutput' );
    pR.addBoundTexture( this.physicsParticles , 't_ooPos' , 'ooOutput' );


    var uniforms = {
      lookup:{ type:"t" , value:null }
    }

    var lineMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: shaders.vertexShaders.lineRender,
      fragmentShader: shaders.fragmentShaders.lineRender
    });

    this.line = new THREE.Line( lineGeo , lineMat );
    this.line.type = THREE.LinePieces;
    
    this.physicsRenderer.addBoundTexture( this.line , 'lookup' , 'output' );


    this.applyUniforms();

  }


  FurryTail.prototype.addToScene = function(){

    scene.add( this.physicsParticles );
    scene.add( this.line );


  }

  FurryTail.prototype.update = function(){

    this.physicsRenderer.update();

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

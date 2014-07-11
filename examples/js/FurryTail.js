  

  var lineGeo = createLineGeo();

  function FurryTail( group , params ){

    this.group = group;

    this.params = _.defaults( params || {} , {

      id:                 Math.floor( Math.random() * 100000),
      type:               'test',
      
      size:               32,
      sim:                shaders.simulationShaders.tailSim,
      simulationUniforms: {},
      leader:             new THREE.Object3D(),
      lineGeo:            lineGeo,
      audio:              audioController,

      particleSprite:     THREE.ImageUtils.loadTexture('../img/sprite/cabbibo.png'),
      color1:             new THREE.Vector3( 1 , 1 , 1 ),
      color2:             new THREE.Vector3( 1 , 1 , 1 ),
      color3:             new THREE.Vector3( 1 , 1 , 1 ),
      color4:             new THREE.Vector3( 1 , 1 , 1 ),
      
      // Interaction with other tails
      physicsParams:      {
        forceMultiplier:  1,
        maxVel:           2,
        dampening:      .99999
      },
    
      particleSize: 4.,
      iriLookup: THREE.ImageUtils.loadTexture('../img/iriLookup.png')

    });

    this.active = false;

    this.setParams( this.params );

    this.lineUniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
      t_audio:{ type:"t" , value:null },
      color1: { type:"v3" , value:this.color1 },
      color2: { type:"v3" , value:this.color2 },
      color3: { type:"v3" , value:this.color3 },
      color4: { type:"v3" , value:this.color4 },
    }

    this.particleUniforms = {
      t_pos:{ type:"t" , value:null },
      t_oPos:{ type:"t" , value:null },
      t_ooPos:{ type:"t" , value:null },
      t_sprite:{ type:"t", value:null },
      t_audio:{ type:"t" , value:null },
      particleSize: { type:"f" , value: this.particleSize },
      color1: { type:"v3" , value:this.color1 },
      color2: { type:"v3" , value:this.color2 },
      color3: { type:"v3" , value:this.color3 },
      color4: { type:"v3" , value:this.color4 },
    }

   
    // Other Tails of the same type
    this.brethren = [];
  
    // Physics
    this.position   = this.leader.position;
    this.velocity   = new THREE.Vector3();  
    this.force      = new THREE.Vector3();  


    this.position.set(

        (Math.random() - .5 ) * 100,
        (Math.random() - .5 ) * 100,
        (Math.random() - .5 ) * 100

    );

    this.velocity.set(

        (Math.random() - .5 ) * 4,
        (Math.random() - .5 ) * 4,
        (Math.random() - .5 ) * 4

    );

    this.velocity.normalize();
    this.velocity.multiplyScalar( this.physicsParams.maxVel );

    this.distanceForces = [];
    this.distanceInverseForces = [];
    this.distanceInverseSquaredForces = [];
    this.distanceSquaredForces = [];
    this.normalForces = [];
    this.steeringForces = [];
    this.springForces = [];
    this.collisionForces = [];


    this.renderer     = renderer; 

    this.physicsRenderer = new PhysicsRenderer( 
      this.size,
      this.sim,
      renderer 
    );
   
    this.particleUniforms.t_sprite.value = this.particleSprite;

    if( this.particleUniforms.t_audio){
      this.particleUniforms.t_audio.value = this.audio.texture;
    }
    
    if( this.lineUniforms.t_audio){
      this.lineUniforms.t_audio.value = this.audio.texture;
    }
  
    var mat = new THREE.ShaderMaterial({
      uniforms: this.particleUniforms,
      vertexShader: shaders.vertexShaders.render,
      fragmentShader: shaders.fragmentShaders.render,
      transparent: true,
      depthWrite: false
    })

    var geo = ParticleUtils.createLookupGeometry( this.size );

    this.physicsParticles  = new THREE.ParticleSystem( geo , mat );

    var pR = this.physicsRenderer;
    
    pR.addBoundTexture( this.physicsParticles , 't_pos' , 'output' );
    pR.addBoundTexture( this.physicsParticles , 't_oPos' , 'oOutput' );
    pR.addBoundTexture( this.physicsParticles , 't_ooPos' , 'ooOutput' );
 
    var lineMat = new THREE.ShaderMaterial({
      uniforms: this.lineUniforms,
      vertexShader: shaders.vertexShaders.lineRender,
      fragmentShader: shaders.fragmentShaders.lineRender,    
    });

    this.line = new THREE.Line( this.lineGeo , lineMat );
    this.line.type = THREE.LinePieces;
    
    pR.addBoundTexture( this.line , 't_pos' , 'output' );
    pR.addBoundTexture( this.line , 't_oPos' , 'oOutput' );
    pR.addBoundTexture( this.line , 't_ooPos' , 'ooOutput' );


    var mesh = new THREE.Mesh( new THREE.SphereGeometry( 1 ) );
    var pTexture = ParticleUtils.createPositionsTexture( this.size , mesh );
    this.physicsRenderer.reset( pTexture );
    
    this.applyUniforms();

    this.cloth = new Cloth( 
      this.leader , 
      this.color1 , 
      this.color2 , 
      this.color3 , 
      this.color4  
    );
    this.physicsRenderer.addBoundTexture( this.cloth.physicsRenderer , 't_column' , 'output' );


  }


  FurryTail.prototype.setColors = function( color1 , color2 , color3 ){



  }


  FurryTail.prototype.activate = function(){

    scene.add( this.physicsParticles );
    scene.add( this.line );
    scene.add( this.leader );
    scene.add( this.cloth.mesh );    

    this.active = true;

  }

  FurryTail.prototype.deactivate = function(){

    scene.add( this.physicsParticles );
    scene.add( this.line );
    scene.add( this.leader );
    scene.add( this.cloth.mesh );    

    this.active = false;

  }

  FurryTail.prototype.deactivate = function(){


  }

  FurryTail.prototype.updatePhysics = function(){



  }

  FurryTail.prototype.updatePhysics = function(){


    // attract to bait    *from group*
    // attract to center  *all flagella*
    // attract to breathren 
    // attract to group
    //
    //
    var pp = this.physicsParams;

    for( var i = 0; i < this.distanceForces.length; i++ ){

      var pos = this.distanceForces[i][0];
      var force = this.distanceForces[i][1];
      this.applyDistanceForce( pos , force ); 

    }

    for( var i = 0; i < this.distanceInverseForces.length; i++ ){

      var pos = this.distanceInverseForces[i][0];
      var force = this.distanceInverseForces[i][1];
      this.applyDistanceInverseForce( pos , force ); 

    }

    for( var i = 0; i < this.distanceInverseSquaredForces.length; i++ ){

      var pos = this.distanceInverseSquaredForces[i][0];
      var force = this.distanceInverseSquaredForces[i][1];
      this.applyDistanceInverseSquaredForce( pos , force ); 

    }

    for( var i = 0; i < this.distanceSquaredForces.length; i++ ){

      var pos = this.distanceSquaredForces[i][0];
      var force = this.distanceSquaredForces[i][1];
      this.applyDistanceSquaredForce( pos , force ); 

    }

    for( var i = 0; i < this.normalForces.length; i++ ){

      var pos = this.normalForces[i][0];
      var force = this.normalForces[i][1];
      this.applyNormalForce( pos , force ); 

    }

    for( var i = 0; i < this.springForces.length; i++ ){

      var pos = this.springForces[i][0];
      var force = this.springForces[i][1];
      var length = this.springForces[i][2];
      this.applySpringForce( pos , force , length ); 

    }

    for( var i = 0; i < this.collisionForces.length; i++ ){

      var pos = this.collisionForces[i][0];
      var radius = this.collisionForces[i][1];
      this.applyCollisionForce( pos , radius ); 

    }

    for( var i = 0; i < this.steeringForces.length; i++ ){

      var pos = this.steeringForces[i][0];
      var radius = this.steeringForces[i][1];
      this.applySteeringForce( pos , radius ); 

    }





    var finalForce = this.force.multiplyScalar( pp.forceMultiplier );
    this.velocity.add( finalForce );

    if( this.velocity.length() > pp.maxVel ){

      this.velocity.normalize();
      this.velocity.multiplyScalar( pp.maxVel );

    }



    this.position.add( this.velocity.clone().multiplyScalar( dT.value * 80 ));
    this.velocity.multiplyScalar( pp.dampening ); // turn to vector dampening

    this.force.set( 0 , 0 , 0);

  }

  FurryTail.prototype.updateTail = function(){
    this.physicsRenderer.update();
    this.cloth.update();
  }


  FurryTail.prototype.addDebugScene = function(){

    this.physicsRenderer.addDebugScene( scene );

  }


  FurryTail.prototype.applyUniforms = function(){

    var uO = this.simulationUniforms;

    for( var propt in uO ){
      this.physicsRenderer.setUniform( propt , uO[propt] );
    }

    this.physicsRenderer.setUniform( 't_audio' ,{
      type:"t",
      value: this.audio.texture
    });

    this.physicsRenderer.setUniform( 'leader' , { 
      type:"v3" , 
      value: this.position
    });

    this.physicsRenderer.setUniform( 'dT' , dT );

  }

  FurryTail.prototype.setParams = function( params ){
    for( propt in params ){
      var param = params[propt];
      // To make sure that we are passing in objects
      if( typeof param === 'object' ){
        if( this[propt] ){
          for( propt1 in param ){
            var param1 = param[propt1]
            if( typeof param === 'object' ){
              if( this[propt][propt1] ){
                for( propt2 in param1 ){
                  var param2 = param[propt2]
                  this[propt][propt1][propt2] = param2
                }
              }else{
                this[propt][propt1] = param1;
              }
            }else{
              this[propt][propt1] = param[propt1]
            }
          }
        }else{
          this[propt] = param
        }
      }else{
        this[propt] = param
      }
    }
  }
  
  FurryTail.prototype.updateBrethren = function(){

    this.brethren = this.group.tails;

  }

  FurryTail.prototype.addDistanceForce = function( pos , power ){

    console.log('nanssss');
    this.distanceForces.push( [ pos , power ] );

  }


  FurryTail.prototype.applyDistanceForce = function( pos , power ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();
    
    dif.normalize();
    dif.multiplyScalar( l * power );

    this.force.add( dif );
    
  }

  FurryTail.prototype.addDistanceInverseForce = function( pos , power ){

    this.distanceInverseForces.push( [ pos , power ] );

  }


  FurryTail.prototype.applyDistanceInverseForce = function( pos , power ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();
    
    dif.normalize();
    dif.multiplyScalar( power / l );

    this.force.add( dif );
    
  }

  FurryTail.prototype.addDistanceInverseSquaredForce = function( pos , power ){

    this.distanceInverseSquaredForces.push( [ pos , power ] );

  }


  FurryTail.prototype.applyDistanceInverseSquaredForce = function( pos , power ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();
    
    dif.normalize();
    dif.multiplyScalar( power / (l*l) );

    this.force.add( dif );
    
  }




  FurryTail.prototype.addDistanceSquaredForce = function( pos , power ){

    this.distanceSquaredForces.push( [ pos , power ] );

  }

  FurryTail.prototype.applyDistanceSquaredForce = function( pos , power ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();
    
    dif.normalize();
    dif.multiplyScalar( l * l * power );

    this.force.add( dif );


  }


  FurryTail.prototype.addNormalForce = function( pos , power ){

    this.normalForces.push( [ pos , power ] );

  }

  FurryTail.prototype.applyNormalForce = function( pos , power ){

     var dif = pos.clone().sub( this.position );
    var l   = dif.length();
    
    dif.normalize();
    dif.multiplyScalar(  power );

    this.force.add( dif );


  }


  FurryTail.prototype.addSpringForce = function( pos , power , length ){

    this.springForces.push( [ pos , power , length ] );

  }

  FurryTail.prototype.applySpringForce = function( pos , power , length ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();

    var lDif = l - length;
    
    dif.normalize();
    dif.multiplyScalar( lDif * power );

    this.force.add( dif );


  }

  FurryTail.prototype.addCollisionForce = function( pos , radius ){

    this.collisionForces.push([ pos , radius ]);

  }

  FurryTail.prototype.applyCollisionForce = function( pos , radius ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();

    if( l < radius ){

      var normal = dif.clone().normalize();
      normal.multiplyScalar( -1 );
      var direction = this.velocity.clone();

      var dot = direction.dot( normal );
      normal.multiplyScalar( -2 * dot );
      this.velocity.copy( direction.sub( normal ));
      this.velocity.multiplyScalar( -100000 );

      var newPos = dif.normalize().multiplyScalar( -radius );
      newPos.add( pos );
      this.position.copy( newPos );

    }

  }

  FurryTail.prototype.addSteeringForce = function( pos , amount ){

    this.steeringForces.push([ pos , amount ]);

  }

  FurryTail.prototype.applySteeringForce = function( pos , amount ){

    var dif = pos.clone().sub( this.position );
    var l   = dif.length();

    if( l > 0 ){

      dif.normalize();

      dif.multiplyScalar( this.physicsParams.maxVel );

      dif.sub( this.velocity );

      this.force.add( dif.multiplyScalar( amount ) );    
    
    }else{


    }

  }






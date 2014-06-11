  

  var lineGeo = createLineGeo();

  var color1 = new THREE.Vector3( Math.random() , Math.random() , Math.random() );
  var color2 = new THREE.Vector3( Math.random() , Math.random() , Math.random() );
  var color3 = new THREE.Vector3( Math.random() , Math.random() , Math.random() );
  var color4 = new THREE.Vector3( Math.random() , Math.random() , Math.random() );


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

      particleSprite:     THREE.ImageUtils.loadTexture('../img/cabbibo.png'),
      color1:             new THREE.Vector3( 1 , 1 , 1 ),
      color2:             new THREE.Vector3( 1 , 1 , 1 ),
      color3:             new THREE.Vector3( 1 , 1 , 1 ),
      color4:             new THREE.Vector3( 1 , 1 , 1 ),
      
      // Interaction with other tails
      physicsParams:      {
        repelRadius:         20,
        dampening:           .95,
        attractPower:        .001,
        repelPower:          .01,
        baitPower:           .0001,
      },
    
      particleSize: 1

    });

    this.setParams( this.params );
    

    this.cloth = new Cloth( this.leader );

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

    
    this.brethren = [];
    
    this.position       = this.leader.position;
    this.velocity       = new THREE.Vector3();  

    //this.leader.position = this.position;
   

    this.position.set(

        (Math.random() - .5 ) * 100,
        (Math.random() - .5 ) * 100,
        (Math.random() - .5 ) * 100

    );

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


    var mesh = new THREE.Mesh( new THREE.SphereGeometry( 500 ) );
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

  FurryTail.prototype.updatePhysics = function(){

    var force = new THREE.Vector3();

    // attract to bait    *from group*
    // attract to center  *all flagella*
    // attract to breathren 
    // attract to group
    //
    //
    var pp = this.physicsParams
  
    //console.log( this.group.position );
    var baitDif = this.group.position.clone().sub( this.position );
    //force.sub( baitDif.multiplyScalar( 10 ));

    //console.log( baitDif );
    force.add( baitDif.clone().multiplyScalar( pp.baitPower ));



    for( var i = 0; i < this.brethren.length; i++ ){

      var otherTail = this.brethren[i];

      if( i !== this ){

        var dif = otherTail.position.clone().sub( this.position );
        var l = dif.length();

        //console.log( this.repelRadius );
        if( l < pp.repelRadius ){
          force.sub( dif.multiplyScalar( pp.repelPower ) );
        }else{
          force.add( dif.multiplyScalar( pp.attractPower ) );
        }

      }
    
    }

    //console.log( force.x );

    this.velocity.add( force );
    this.position.add( this.velocity );

    this.velocity.multiplyScalar( pp.dampening ); // turn to vector dampening

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

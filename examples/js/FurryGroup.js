
  function FurryGroup( title , numOf , params ){


    this.tails = [];

    var mR = Math.random;
    this.params = _.defaults( params || {},{

      bait: new THREE.Object3D(),
      centerForce: 1,
      center: new THREE.Object3D(),
      physicsParams:      {
        repelRadius:         50,
        dampening:           .99,
        attractPower:        .0001,
        repelPower:          .003,
        baitPower:           .0002,
      },

      color1: new THREE.Vector3( mR() , mR() , mR() ),    
      color2: new THREE.Vector3( mR() , mR() , mR() ),    
      color3: new THREE.Vector3( mR() , mR() , mR() ),    
      color4: new THREE.Vector3( mR() , mR() , mR() ),    
   
      particleSize:1

    });

    this.setParams( this.params );

    this.bait.position.set(
      ( Math.random() - .5 ) * 100,
      ( Math.random() - .5 ) * 100,
      ( Math.random() - .5 ) * 100
    );

    this.position = this.bait.position;
    this.velocity = new THREE.Vector3();

    var folder = gui.addFolder( title );

    var upperForces = folder.addFolder( 'Group Interaction' );

    upperForces.add( this.physicsParams , 'repelRadius' , 0 , 100 );
    upperForces.add( this.physicsParams , 'dampening' , .8 , 1   );
    upperForces.add( this.physicsParams , 'attractPower' , .0 , .01   );
    upperForces.add( this.physicsParams , 'repelPower' , .0 , .01   );
    upperForces.add( this.physicsParams , 'baitPower' , .0 , .01   );

    /*

       Forces

    */

    var interactionParams = folder.addFolder( 'Interaction' );

    var p = {
      repelRadius:        5,
      dampening:           .95,
      attractPower:        .0001,
      repelPower:          .01,
      baitPower:           .001,
    }


    var physicsParams = p;
 
    interactionParams.add( p , 'repelRadius' , 0 , 100 );
    interactionParams.add( p , 'dampening' , .7 , .99999 );
    interactionParams.add( p , 'attractPower' , 0 , .01 );
    interactionParams.add( p , 'repelPower' , 0 , .01 );
    interactionParams.add( p , 'baitPower' , 0 , .01 );
    
    /*

      Setting up attraction / repulsion uniforms

    */

    var tailParams = folder.addFolder( 'Tail Physics' );
      
    var audioAmount = { type:"f" , value: .5 };
    var audioPower = { type:"f" , value: 3 };


    var d_spA = { type:"f" , value: 1.1 }
    var f_spA = { type:"f" , value: .1  }

    var d_bA = { type:"f" , value: .1 }
    var f_bA = { type:"f" , value: .4  }
  
    var d_bR = { type:"f" , value: 10.1 }
    var f_bR = { type:"f" , value: .01  }
    
    var d_sA = { type:"f" , value: 1.1 }
    var f_sA = { type:"f" , value: .1  }
    
    var d_sR = { type:"f" , value: 3.1 }
    var f_sR = { type:"f" , value: .01  }
    
    var d_sSA = { type:"f" , value: 1.1 }
    var f_sSA = { type:"f" , value: .1  }
    
    var d_sSR = { type:"f" , value: 3.1 }
    var f_sSR = { type:"f" , value: .01  }


    var allUniforms = {

      dist_spineAttract     : d_spA,
      force_spineAttract    : f_spA ,
      dist_bundleAttract    : d_bA,
      force_bundleAttract   : f_bA,
      dist_bundleRepel      : d_bR,
      force_bundleRepel     : f_bR,
      dist_subAttract       : d_sA,
      force_subAttract      : f_sA,
      dist_subRepel         : d_sR,
      force_subRepel        : f_sR,
      dist_subSubAttract    : d_sSA,
      force_subSubAttract   : f_sSA,
      dist_subSubRepel      : d_sSR,
      force_subSubRepel     : f_sSR,
      dT                    : dT,
      audioPower            : audioPower,
      audioAmount           : audioAmount,

    }

    tailParams.add( audioPower , 'value' , 0 , 3 ).name( 'audioPower' );
    tailParams.add( audioAmount , 'value' , 0 , 1  ).name( 'audioAmount' );

    tailParams.add( d_spA, 'value' , 0 , 10  ).name( 'dist_spineAttract' );
    tailParams.add( f_spA, 'value' , -0.1 , .5  ).name( 'force_spineAttract' );
    
    tailParams.add( d_bA,  'value' , 0 , 10  ).name( 'dist_bundleAttract' );
    tailParams.add( f_bA,  'value' , -0.1, .5  ).name( 'force_bundleAttract' );
    tailParams.add( d_bR,  'value' , 0 , 10  ).name( 'dist_bundleRepel' );
    tailParams.add( f_bR,  'value' , -0.1 , .05 ).name( 'force_bundleRepel' );
    
    tailParams.add( d_sA,  'value' , 0 , 10  ).name( 'dist_subAttract' );
    tailParams.add( f_sA,  'value' , -0.1 , .5  ).name( 'force_subAttract' );
    tailParams.add( d_sR,  'value' , 0 , 10  ).name( 'dist_subRepel' );
    tailParams.add( f_sR,  'value' , -0.1 , .2  ).name( 'force_subRepel' );
    
    tailParams.add( d_sSA, 'value' , 0 , 10  ).name( 'dist_subSubAttract' );
    tailParams.add( f_sSA, 'value' , -0.1 , .5  ).name( 'force_subSubAttract' );
    tailParams.add( d_sSR, 'value' , 0 , 10  ).name( 'dist_subSubRepel' );
    tailParams.add( f_sSR, 'value' , -0.1 , .2  ).name( 'force_subSubRepel' );


    var tailColor = folder.addFolder( 'Render Tail / Particles' );

    tailColor.add( this , 'particleSize' , 0 , 5 ).onChange( function(v){
      for( var i = 0; i < this.tails.length; i++ ){
        var fT = this.tails[i];
        fT.particleUniforms.particleSize.value = v;
      }
    }.bind( this ));

    var c ={ 
      spineColor: '#ff0000',
      subColor:   '#eeaa00',
      subSubColor:'#0000ff',
      bundleColor:'#999999' 
    }

    tailColor.addColor( c , 'spineColor' ).onChange( function( value ){

     
      var col = new THREE.Color( value );
      console.log( col.r );
      for( var i = 0; i < this.tails.length; i++ ){

        var fT = this.tails[i];

        fT.color1.x = col.r;
        fT.color1.y = col.g;
        fT.color1.z = col.b;

      }
    
    }.bind( this ));

    tailColor.addColor( c , 'subColor' ).onChange( function( value ){

      var col = new THREE.Color( value );
      for( var i = 0; i < this.tails.length; i++ ){

        var fT = this.tails[i];

        fT.color2.x = col.r;
        fT.color2.y = col.g;
        fT.color2.z = col.b;

      }
    
    }.bind( this ));


    tailColor.addColor( c , 'subSubColor' ).onChange( function( value ){

      var col = new THREE.Color( value );
      for( var i = 0; i < this.tails.length; i++ ){

        var fT = this.tails[i];

        fT.color3.x = col.r;
        fT.color3.y = col.g;
        fT.color3.z = col.b;

      }
    
    }.bind( this ));

    tailColor.addColor( c , 'bundleColor' ).onChange( function( value ){

      var col = new THREE.Color( value );
      for( var i = 0; i < this.tails.length; i++ ){

        var fT = this.tails[i];
        fT.color4.x = col.r;
        fT.color4.y = col.g;
        fT.color4.z = col.b;
      }
    
    }.bind( this ));
   

    /*

       TAIL CREATION

    */

    for( var i = 0; i < numOf; i++ ){

      var furryTail = new FurryTail( this , {
        type:'title',
        simulationUniforms:allUniforms,
        physicsParams: physicsParams,
        particleSize: this.particleSize,
        color1:       this.color1,
        color2:       this.color2,
        color3:       this.color3,
        color4:       this.color4
      });

      furryTails.push( furryTail );
      this.tails.push( furryTail );
    
    }

    for( var i = 0; i < numOf; i++ ){
      this.tails[i].updateBrethren();
    }

    this.addToScene();




  }

  FurryGroup.prototype.updateBrethren = function(){

    this.brethren = groups;

  }

  FurryGroup.prototype.updatePhysics = function(){

    var force = new THREE.Vector3();

    // attract to bait    *from group*
    // attract to center  *all flagella*
    // attract to breathren 
    // attract to group
    //
    //
    var pp = this.physicsParams
  
    //console.log( this.group.position );
    var baitDif = this.center.position.clone().sub( this.position );
    //force.sub( baitDif.multiplyScalar( 10 ));

    //console.log( baitDif );
    force.add( baitDif.clone().multiplyScalar( pp.baitPower ));



    for( var i = 0; i < groups.length; i++ ){

      var otherTail = groups[i];

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

    this.velocity.add( force );

    this.position.add( this.velocity );
    this.velocity.multiplyScalar( .99 );

    //this.bait.position.x += Math.sin( d


  }

  FurryGroup.prototype.addToScene = function(){

    for( var i = 0; i < this.tails.length; i++ ){

      this.tails[i].addToScene();

    }

  }

  FurryGroup.prototype.setParams = function( params ){
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

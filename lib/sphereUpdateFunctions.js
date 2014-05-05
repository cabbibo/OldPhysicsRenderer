var sphereUpdateFunctions = {


  twitch:function(){

    var camVel = oCamPos.sub( camera.position );

    var audio = audioController.analyzer.array;
    var count = audioController.analyzer.array.length;
    //console.log( audio.length );
    //console.log( );
    //console.log( spherePositions[0] );
    for( var i = 0; i < spherePositions.length; i++ ){

      var s1 = spherePositions[i];
      var v1 = sphereVelocities[i];

      var index = Math.floor((i / 100 ) * count);
      var audioValue = audio[ index ];
      for( var j = 0; j < spherePositions.length; j++ ){

        if( i != j ){

          var s2 = spherePositions[j];

          var dif = s1.clone().sub( s2 );
          var f = dif.length();

          var l = f - 50;

          v1.sub(dif.normalize().multiplyScalar( l / 1000));

        }
      }


      v1.sub( s1.clone().normalize().multiplyScalar(.3));
      v1.add( s1.clone().normalize().multiplyScalar(.3 * ( audioValue / 256 ) ));
      var tmp = new THREE.Vector3( Math.sin( v1.x *19) , Math.sin( v1.y*16 ) , Math.sin( v1.z * 17 ) );
      v1.add(tmp.multiplyScalar( .1 ));
      //v1.add( camVel.clone().multiplyScalar(  1 / ( 100 + (.01 * ( 50 - i) ))) );
      //var aScalar = .95 +  * (  audioValue / 256 );

      //v1.multiplyScalar( aScalar


      tmp.set( 0 , 1 , 0 );
      //tmp.multiplyScalar( 
     // v1.add( 

      s1.add( v1.clone().multiplyScalar( .0 + ( audioValue / 100 )));

      var aScalar = .9 + .1 * (  audioValue / 256 );
      v1.multiplyScalar( .9 );

    }

  },

  gravity: function(){

    var audio = audioController.analyzer.array;
    var count = audioController.analyzer.array.length;

     for( var i = 0; i < spherePositions.length; i++ ){

      var s1 = spherePositions[i];
      var v1 = sphereVelocities[i];

      var index = Math.floor((i / 100 ) * count );
      var audioValue = audio[ index ];


      for( var j = 0; j < spherePositions.length; j++ ){

        if( i != j ){

          var s2 = spherePositions[j];

          var dif = s1.clone().sub( s2 );
          var f = dif.length();

          var l = f - 20;

          v1.sub(dif.normalize().multiplyScalar( l / (1 +audioValue)));

        }


      }


      var d = s1.length() - 10;
      v1.sub( s1.clone().normalize().multiplyScalar( d) );

      var l = v1.length();

      if( l > 100 ){
      
        v1.normalize().multiplyScalar( 10 );
      }
      
      s1.add( v1.clone().multiplyScalar( .01 ));
      v1.multiplyScalar( .99 );
    }





  }

  
}

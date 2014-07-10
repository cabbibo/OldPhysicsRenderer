function initMechanics(){


  projector = new THREE.Projector();
  raycaster = new THREE.Raycaster();

  mouse = new THREE.Vector2();
  mouse.down = false;

  window.addEventListener( 'mousemove' , onMouseMove , false );
  window.addEventListener( 'mousedown' , onMouseDown , false );
  window.addEventListener( 'mouseup' , onMouseUp , false );


  function onMouseMove( event ) {

      event.preventDefault();
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  }

  function onMouseDown( event ) {

    if( MONOME_INTERSECTED ){

      if( MONOME_INTERSECTED.monome.selected == false ){

        MONOME_INTERSECTED.monome.select();

      }else{

        MONOME_INTERSECTED.monome.deselect();

      }

    }

    mouse.down = true;  
  }

  function onMouseUp( event ) {
    mouse.down = false;  
  }
    

}


function updateMechanics( delta ){

 // controls.update( delta );

 // if( !paused ){
   /* intersectPlane.position.copy( camera.position );

    var dT = distanceToIntersectPlane;
    var m =  ( controls.speed / controls.maxSpeed ); 
    var d = dT + m * m * dT * 3;
    var vector = new THREE.Vector3( 0, 0, -d );
    vector.applyQuaternion( camera.quaternion );
    intersectPlane.position.add( vector );

    intersectPlane.lookAt( camera.position );*/
     
    var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
    projector.unprojectVector( vector, camera );


    raycaster.set( camera.position, vector.sub( camera.position ).normalize() );

    var intersects = raycaster.intersectObject( floor );

    if( intersects.length > 0 ){
    
      FLOOR_INTERSECT.copy( intersects[0].point ); 
      FLOOR_INTERSECT.dirVector = vector;
      
     // bait.position.copy( intersects[0].point );
    }


    var intersects = raycaster.intersectObjects( MONOME_MESHES );

    if( intersects.length > 0  ){

      var firstIntersected = intersects[0].object;

      if( !MONOME_INTERSECTED ){

        MONOME_INTERSECTED = firstIntersected;

        //console.log
        MONOME_INTERSECTED.monome.hoverOver();

      }else{

        if( MONOME_INTERSECTED != firstIntersected ){

          console.log('WSISDS' );

          MONOME_INTERSECTED.monome.hoverOut();

          MONOME_INTERSECTED = firstIntersected;

          MONOME_INTERSECTED.monome.hoverOver();

        }

      }


    }else{

      if( MONOME_INTERSECTED ){

        MONOME_INTERSECTED.monome.hoverOut();
        MONOME_INTERSECTED = undefined;

      }

    }






    //camera.lookAt( dragonFish.leader.position );
      
  //}


}





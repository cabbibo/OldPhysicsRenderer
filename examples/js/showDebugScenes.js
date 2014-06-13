function showDebugScenes( tails ){

  for( var i = 0; i< furryTails.length; i ++ ){

    var fT = furryTails[i];


    var subScene = new THREE.Object3D();


    fT.cloth.physicsRenderer.createDebugScene();
    fT.cloth.physicsRenderer.addDebugScene( subScene );
    fT.cloth.physicsRenderer.debugScene.position.set( 0 ,  -52.5 , 0 );

    fT.physicsRenderer.createDebugScene();
    fT.physicsRenderer.addDebugScene( subScene );
    fT.physicsRenderer.debugScene.position.set( 0 , 52.5 , 0 );

    var theta = 2 * Math.PI *  i / furryTails.length; 
    var r = 700;

    subScene.rotation.z = theta - Math.PI/2;

    var x = r * Math.cos( theta );
    var y = r * Math.sin( theta );
    var z = 0;

    subScene.position.set( x , y  , z);
    fT.fullDebugScene = subScene;

    scene.add( subScene );

  }

}

function removeDebugScenes(){

  for( var i = 0; i< furryTails.length; i ++ ){

    var fT = furryTails[i];

    scene.remove( fT.fullDebugScene );


  }



}

 var textCreator;

 var speechText = [
  "Hello, my name is Isaac",
  "and I work at Leap.",
  "",
  "I am here today to talk to you about the future",
  "Because the future is all there really is",
  "",
  "The Past is a beast. It will consume all in its",
  "Decadent claws. But the future is love. It is",
  "Beauty, and it is all we can hope for.",
  "",
  "",
  "Hello, my name is Isaac",
  "and I work at Leap.",
  "",
  "I am here today to talk to you about the future",
  "Because the future is all there really is",
  "",
  "The Past is a beast. It will consume all in its",
  "Decadent claws. But the future is love. It is",
  "Beauty, and it is all we can hope for.",
  "",
  "",
  "Hello, my name is Isaac",
  "and I work at Leap.",
  "",
  "I am here today to talk to you about the future",
  "Because the future is all there really is",
  "",
  "The Past is a beast. It will consume all in its",
  "Decadent claws. But the future is love. It is",
  "Beauty, and it is all we can hope for.",

 ].join("\n");

function initTextParticles(){

  var vs  = shaders.vertexShaders.text;
  var fs  = shaders.fragmentShaders.text;
  var sim = shaders.simulationShaders.textPhysics;

  var creator = new TextParticles({
    vertexShader:   vs,
    fragmentShader: fs
  });

    
  var speedUniform = { type:"v3" , value: new THREE.Vector3(0 , .1 , 0) } 
  vs_particles = creator.createTextParticles( speechText );
  sim_particles = creator.createTextParticles( fs );
  fs_particles = creator.createTextParticles(sim);

  vs_particles.position.x =0; //-350;
  vs_particles.position.y =0; //250;
  
  fs_particles.position.x = -350;
  fs_particles.position.y = -50;
  
  sim_particles.position.x = -350;
  sim_particles.position.y = -400;

  //vs_particles.position.z = -100;
  scene.add( vs_particles );
 // scene.add( fs_particles );
 // scene.add( sim_particles );

  console.log( 'VS PARTICLES' , vs_particles , vs_particles.material.uniforms.t_lookup.value );
  var s = vs_particles.size;
  var simShader = shaders.simulationShaders.textPhysics;

  var speedUniform = { type:"v3" , value:new THREE.Vector3() }
  var cameraMat = { type:"m4" , value:camera.matrixWorld}
  var cameraPos = { type:"v3" , value:camera.position } 

  vsTextPosShader = new PhysicsRenderer( s , simShader , renderer );
  vsTextPosShader.setUniform( 't_to' , {
    type:"t",
    value:vs_particles.material.uniforms.t_lookup.value
  });


  vsTextPosShader.createDebugScene();
  vsTextPosShader.addDebugScene( scene );
  vsTextPosShader.debugScene.position.y = 0;


  vsTextPosShader.setUniform( 'speed' , speedUniform );
  vsTextPosShader.setUniform( 'timer' , timer );
  vsTextPosShader.setUniform( 'cameraMat' , cameraMat );
  vsTextPosShader.setUniform( 'cameraPos' , cameraPos );
  vsTextPosShader.setUniform( 'offsetPos' , { type:"v3" , value: new THREE.Vector3( 200 , 200 , 0 ) } );
  vsTextPosShader.setUniform( 'handPos' , { type:"v3" , value: riggedSkeleton.hand.position } );

  vsTextPosShader.addBoundTexture( vs_particles , 't_lookup' , 'output' );
/*

  var s = fs_particles.size;

  fsTextPosShader = new PhysicsRenderer( s , simShader , renderer );
  fsTextPosShader.setUniform( 't_to' , {
    type:"t",
    value:fs_particles.material.uniforms.t_lookup.value
  });

  fsTextPosShader.setUniform( 'speed' , speedUniform );
  fsTextPosShader.setUniform( 'timer' , timer );
  fs_particles.material.uniforms.t_lookup.value = fsTextPosShader.output;


  var s = sim_particles.size;

  simTextPosShader = new PhysicsRenderer( s , simShader , renderer );
  simTextPosShader.setUniform( 't_to' , {
    type:"t",
    value:sim_particles.material.uniforms.t_lookup.value
  });

  simTextPosShader.setUniform( 'speed' , speedUniform );
  simTextPosShader.setUniform( 'timer' , timer );

  sim_particles.material.uniforms.t_lookup.value = simTextPosShader.output;
*/

}

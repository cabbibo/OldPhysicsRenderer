 var textCreator;

function initTextParticles(){

  var vs  = shaders.vertexShaders.text;
  var fs  = shaders.fragmentShaders.text;
  var sim = shaders.simulationShaders.textPhysics;

  var creator = new TextParticles({
    vertexShader:   vs,
    fragmentShader: fs
  });

    var speedUniform = { type:"v3" , value: new THREE.Vector3() } 
  console.log( creator );
  vs_particles = creator.createTextParticles( vs );
  sim_particles = creator.createTextParticles( fs );
  fs_particles = creator.createTextParticles(sim);

  vs_particles.position.x = -350;
  vs_particles.position.y = 250;
  
  fs_particles.position.x = -350;
  fs_particles.position.y = -50;
  
  sim_particles.position.x = -350;
  sim_particles.position.y = -400;

  scene.add( vs_particles );
  scene.add( fs_particles );
  scene.add( sim_particles );

  var s = vs_particles.size;
  var simShader = shaders.simulationShaders.textPhysics;

  var speedUniform = { type:"v3" , value:new THREE.Vector3() }

  vsTextPosShader = new PhysicsRenderer( s , simShader , renderer );
  vsTextPosShader.setUniform( 't_to' , {
    type:"t",
    value:vs_particles.material.uniforms.t_lookup.value
  });

  vsTextPosShader.setUniform( 'speed' , speedUniform );
  vsTextPosShader.setUniform( 'timer' , timer );
  vs_particles.material.uniforms.t_lookup.value = vsTextPosShader.output;


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


}

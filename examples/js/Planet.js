function Planet( type , color1 , color2 , color3 , color4 ){

  this.type     = type;

  this.color1 = color1;
  this.color2 = color2;
  this.color3 = color3;
  this.color4 = color4;

  var tNormal = THREE.ImageUtils.loadTexture( '../img/normals/moss_normal_map.jpg' );
    
  this.uniforms = {

    lightPos: { type:"v3" , value: center.position },
    tNormal:{type:"t",value:tNormal},
    time:timer,

    color1:{ type:"v3" , value: color1 },
    color2:{ type:"v3" , value: color2 },
    color3:{ type:"v3" , value: color3 },
    color4:{ type:"v3" , value: color4 },

  }

  this.vertexShader   = shaders.vertexShaders.planet;
  this.fragmentShader = shaders.fragmentShaders.planet;

  this.material = new THREE.ShaderMaterial({

    uniforms: this.uniforms,
    vertexShader: this.vertexShader,
    fragmentShader: this.fragmentShader

  });

  this.geometry = new THREE.IcosahedronGeometry( 100 , 4 );

  this.mesh = new THREE.Mesh( this.geometry, this.material );

  this.position = this.mesh.position;
  this.velocity = new THREE.Vector3();

  this.position.x = ( Math.random() - .5 ) * 1000;
  this.position.y = ( Math.random() - .5 ) * 1000;
  this.position.z = ( Math.random() - .5 ) * 1000;

  objectControls.add( this.mesh );
  scene.add( this.mesh );
  

}


Planet.prototype.update = function(){



}

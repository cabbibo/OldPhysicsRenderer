

function Monome( whichHit , whichNote , mesh ){

  this.active = false;
  this.mesh = mesh;

  this.whichHit = whichHit;
  this.whichNote = whichNote;



}

Monome.prototype.activeMaterial = new THREE.MeshBasicMaterial({color:0xff0000});
Monome.prototype.unactiveMaterial = new THREE.MeshBasicMaterial({color:0x00ff00});

Monome.prototype.update = function( whichHit ){

  console.log('sssssda');
  if( whichHit !== this.whichHit ){

    if( this.active == true ){

      this.deactivate();

    }

  }

  if( whichHit === this.whichHit ){

    if( this.active == false ){

      this.activate();

    }

  }

}

Monome.prototype.activate = function(){

  console.log( 'activate' );
  this.active = true;

   this.mesh.material =this.activeMaterial;
  this.mesh.materialNeedsUpdate = true;


}

Monome.prototype.deactivate = function(){

  console.log( 'deactivate' );
  this.active = false;

  this.mesh.material =this.unactiveMaterial;
  this.mesh.materialNeedsUpdate = true;


}

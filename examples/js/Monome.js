
var MONOME_MESHES = [];
var MONOME_NOTES  = [];

var MONOME_INTERSECTED;
function Monome( whichHit , whichNote , mesh ){

  this.active = false;
  this.selected = false;
  this.hovered = false;
  this.mesh = mesh;

  this.mesh.monome = this; // For use in intersections

  this.hit = whichHit;
  this.note = whichNote;

  MONOME_MESHES.push( mesh );

}

Monome.prototype.hoverMaterial = new THREE.MeshBasicMaterial({color:0xff00ff});
Monome.prototype.activeMaterial = new THREE.MeshBasicMaterial({color:0x00ff00,wireframe:true});
Monome.prototype.unactiveMaterial = new THREE.MeshBasicMaterial({color:0xff0000,wireframe:true});
Monome.prototype.activeSelectedMaterial = new THREE.MeshBasicMaterial({color:0xffff00});
Monome.prototype.unactiveSelectedMaterial = new THREE.MeshBasicMaterial({color:0x00ffff});

Monome.prototype.update = function( whichHit ){

  if( whichHit !== this.hit ){

    if( this.active == true ){

      this.deactivate();

    }

  }

  if( whichHit === this.hit ){

    if( this.active == false ){

      this.activate();

    }

  }

}

Monome.prototype.hoverOver = function(){

  console.log('HOBEVERS' );
  tendrils.updateActiveTexture( this.hit , this.note , 0 , 0 , 1 , 0 );
  
  if( !this.selected ){
    
    this.hovered = true;
    this.mesh.material =this.hoverMaterial;
    this.mesh.materialNeedsUpdate = true;

  }



}

Monome.prototype.hoverOut = function(){
  console.log('UNHOBEVERS');

  
  if( !this.selected ){

    tendrils.updateActiveTexture( this.hit , this.note , 0 , 0 , 0 , 0 );
    
    this.hovered = false;
    this.mesh.material =this.unactiveMaterial;
    this.mesh.materialNeedsUpdate = true;

  }


}

Monome.prototype.select = function(){

  tendrils.updateActiveTexture( this.hit , this.note , 0 , 1 , 0 , 0 );
  
  this.selected = true;
  this.mesh.material =this.unactiveSelectedMaterial;
  this.mesh.materialNeedsUpdate = true;

}

Monome.prototype.deselect = function(){
  
  
  tendrils.updateActiveTexture( this.hit , this.note , 0 , 0 , 1 , 0 );

  this.selected = false;
  this.mesh.material =this.unactiveMaterial;
  this.mesh.materialNeedsUpdate = true;


}


Monome.prototype.activate = function(){

  this.active = true;

  //this.mesh.material =this.activeMaterial;
  //his.mesh.materialNeedsUpdate = true;

  if( this.selected ){

    tendrils.updateActiveTexture( this.hit , this.note , 1 , 0 , 0 , 0 );
    
    this.mesh.material =this.activeSelectedMaterial;
    this.mesh.materialNeedsUpdate = true;

    MONOME_NOTES[ this.note ].play();

  }else{


    tendrils.updateActiveTexture( this.hit , this.note , 0 , 0 , 0 , 1 );
    
    this.mesh.material =this.activeMaterial;
    this.mesh.materialNeedsUpdate = true;


  }

}

Monome.prototype.deactivate = function(){

  this.active = false;

  if( this.selected ){

    tendrils.updateActiveTexture( this.hit , this.note , 0 , 1 , 0 , 0 );
    

    this.mesh.material =this.unactiveSelectedMaterial;
    this.mesh.materialNeedsUpdate = true;

  }else{

    tendrils.updateActiveTexture( this.hit , this.note , 0 , 0 , 0 , 0 );
    
    this.mesh.material =this.unactiveMaterial;
    this.mesh.materialNeedsUpdate = true;



  }


}

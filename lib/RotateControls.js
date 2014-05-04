THREE.RotateControls = function ( object, domElement ) {

    var _this = this;
	this.object = object;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

    this.object.velocity = new THREE.Vector3();
    
    // API
    this.dampening = .9;
    this.speed     =  1;
    this.scrollForce = .1;


    this.outerRadius = 40;
    this.innerRadius = 10;

    this.radius = 50;
    this.target = new THREE.Vector3();

    this.object.angle = 0; 
    this.speed = .01;

    this.Y = 0;
    this.ySpeed = 0;

    this.mouse = new THREE.Vector2( 0 , 0 );

    this.update = function(){

      var speed =  this.object.velocity.clone().multiplyScalar( this.speed ) ;
   
      this.object.angle += this.speed;

      this.Y += this.ySpeed;
      if( this.Y > 10 ){
        //this.Y = 20;
        this.ySpeed *= .3;
      }
       if( this.Y < -10 ){
        //this.Y = -20;
        this.ySpeed *= .3;
      }


      var XZ = this.toCart( this.radius , this.object.angle );
      this.object.position.x = XZ.x;
      this.object.position.z = XZ.y;
      //this.object.position.y = this.Y;
      this.object.lookAt( this.target );


      this.speed *= .95;
      this.ySpeed *= .9;

      this.ySpeed -= this.Y / 100;

      if( !this.mouseDown ){
        this.radius +=  (this.outerRadius - this.radius ) / 100.0;
      }else{
 
        this.radius += ( this.innerRadius - this.radius ) / 100.0

        //this.radius -= .1;

      }

    }

    this.toCart = function( r , a ){

      var x = r * Math.cos( a );
      var y = r * Math.sin( a );

      return new THREE.Vector3( x , y );

    }

    
    mousemove = function( e ){

      

      var tmp = this.mouse;

      this.mouse = new THREE.Vector2( e.clientX , e.clientY );


      var dif = this.mouse.clone().sub( tmp );

      var dir = dif.x > 0 ? 1: -1;
      this.speed += dir*(dif.x*dif.x)/500000 ;

     // var y = e.clientY - window.innerHeight/
      var dir = dif.y > 0 ? 1: -1;
      this.ySpeed += dir * Math.pow( dif.y*dif.y , .25 ) / 10;

         



    }

    mousedown = function( e ){

      this.mouseDown = true;

    }

    mouseup = function( e ){
    
      this.mouseDown = false;

    }

    
    window.addEventListener( 'mousemove', mousemove.bind( this ), false );
    window.addEventListener( 'mousedown', mousedown.bind( this ), false );
    window.addEventListener( 'mouseup', mouseup.bind( this ), false );

};

THREE.RotateControls.prototype = Object.create( THREE.EventDispatcher.prototype );

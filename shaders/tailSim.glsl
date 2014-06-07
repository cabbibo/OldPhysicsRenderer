
uniform sampler2D t_oPos;
uniform sampler2D t_pos;


uniform float dT;

uniform vec3 leader;

varying vec2 vUv;


const float size = 1. / 32.;
const float hSize = size / 2.;


const float springDistance1 = 1.1;
const float springDistance2 = 5.1;
const float springDistance2_repel = 5.1;
const float springDistance3 = 1.1;
const float springDistance3_repel = .1;

const float maxVel = 200.;

vec3 springForce( vec3 toPos , vec3 fromPos , float staticLength ){

  vec3 dif = fromPos - toPos;
  vec3 nDif = normalize( dif );
  vec3 balance = nDif * staticLength;

  vec3 springDif = balance - dif;

  return 10000. * springDif;





}

void main(){

  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos , vUv );

  float life = pos.w;
  life -= .1;

  // Get our velocity
  vec3 vel = oPos.xyz - pos.xyz;

  vec3  force = vec3(0.);

  float mIx = floor( (vUv.x -hSize ) / size );
  float mIy = floor( (vUv.y -hSize) / size );

  // Main Index
  vec2 mI = vec2( mIx , mIy );

  // If we are in the first column ( spine )
  if( mI.x < 1.){


    // If we are the upper most spine
    // We are connected to the leader
    if( mI.y < 1.){

      vec3 attract = springForce( leader.xyz , pos.xyz , springDistance1 );
      force += attract * .1 ;

    
    // Every other vertabrae in the spine
    // Gets attracted to the one above it
    }else{

      vec4 otherPos = texture2D( t_pos , vec2( vUv.x , vUv.y - size ) ); 
      
      vec3 attract = springForce( otherPos.xyz , pos.xyz , springDistance1 );
      force += .1 * attract ;

    }


  // The 'sub' objects
  }else{

    // first level
    if( mI.x < 5. ){

      vec4 otherPos = texture2D( t_pos , vec2( hSize , vUv.y ) );
 
      // Attract to the column
      vec3 attract = springForce( otherPos.xyz , pos.xyz , springDistance2 );
      force += attract * .3;

      // Get the 'index' of this verta 
      // in the 4 first level sub objects
      int index = int( (vUv.x - hSize ) / size );



      // Loop through all the other objects in this level
      for( int i = 0; i < 4; i++ ){

        // As long as we are not looking at ourself,
        // repel the other ones
        if( (i - index) != 0 ){

          float lookup = (float(i) * size) -  hSize;

          vec4 otherPos = texture2D( t_pos , vec2( lookup , vUv.y ) );

          vec3 attract = springForce(  pos.xyz , otherPos.xyz , springDistance2_repel );

          force -= attract *.01;  
        
        }
      }


    // The 'Sub Sub' objects
    }else if( mI.x < 21. ){


      // Which chunk

      int index = int( ( vUv.x - (5.* size) ) / size );

      float chunk = floor( float( index / 4) );

      float lookup = (chunk * size) + size;

      vec4 otherPos = texture2D( t_pos , vec2( lookup , vUv.y ) );

      vec3 attract = springForce( otherPos.xyz , pos.xyz , springDistance3 );

      force += .5 * attract;

      int indexInChunk = index - int( chunk * 4. );

      for( int i = 0; i < 4; i++ ){

        if( (i - indexInChunk) != 0 ){

          float lookup = (float(i) * size) + (size*4. + hSize) + (chunk * 4. * size);

          vec4 otherPos = texture2D( t_pos , vec2( lookup , vUv.y ) );

          vec3 attract = springForce( pos.xyz , otherPos.xyz  , springDistance3_repel  * 10.);

          force -= .01 * attract ;           
        }

      }


      
    }


  }

  vec3 dampeningForce = vel * -.3;
  
  force += dampeningForce;
  
  vel += force * dT;

  if( length( vel ) > maxVel ){

    vel = normalize( vel ) * maxVel;

  }

  //vel *= .7;

  vec3 p = pos.xyz + vel * dT ; 

  gl_FragColor = vec4( p , life );


}

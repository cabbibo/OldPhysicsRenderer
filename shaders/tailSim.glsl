
uniform sampler2D t_oPos;
uniform sampler2D t_pos;

uniform vec3 leader;

varying vec2 vUv;


const float size = 1. / 21.;
const float hSize = size / 2.;


const float springDistance1 = .1;
const float springDistance2 = .1;
const float springDistance3 = .1;

vec3 springForce( vec3 toPos , vec3 fromPos , float staticLength ){

  vec3 dif = fromPos - toPos;
  vec3 nDif = normalize( dif );
  vec3 balance = nDif * staticLength;

  vec3 springDif = balance - dif;

  return springDif;




}

void main(){

  vec4 oPos = texture2D( t_oPos , vUv );
  vec4 pos  = texture2D( t_pos , vUv );

  float life = pos.w;
  life -= .1;

  // Get our velocity
  vec3 vel = oPos.xyz - pos.xyz;

  vec3  force = vec3(0.);

  // If we are in the first column ( spine )
  if( vUv.x < size ){


    // If we are the upper most spine
    // We are connected to the leader
    if( vUv.y < size ){

      vec3 attract = springForce( leader.xyz , pos.xyz , springDistance1 );
      force += attract;//.001 * attract * attract * attract ;

    
    // Every other vertabrae in the spine
    // Gets attracted to the one above it
    }else{

      vec4 otherPos = texture2D( t_pos , vec2( vUv.x , vUv.y -size ) ); 
      
      vec3 attract = springForce( otherPos.xyz , pos.xyz , springDistance1 );
      force += 1.5 * attract ;

    }


  // The 'sub' objects
  }else{

    // first level
    if( vUv.x < size * 5. ){

      vec4 otherPos = texture2D( t_pos , vec2( hSize , vUv.y ) );
 
      // Attract to the column
      vec3 attract = springForce( otherPos.xyz , pos.xyz , springDistance2 );
      force += attract * 5.5;

      // Get the 'index' of this verta 
      // in the 4 first level sub objects
      int index = int( (vUv.x - hSize ) / size );



      // Loop through all the other objects in this level
      /*for( int i = 0; i < 4; i++ ){

        // As long as we are not looking at ourself,
        // repel the other ones
        if( (i - index) != 0 ){

          float lookup = (float(i) * size) -  hSize;

          vec4 otherPos = texture2D( t_pos , vec2( lookup , vUv.y ) );

          vec3 attract = springForce(  pos.xyz , otherPos.xyz , springDistance2 * 10. );

          force += attract ;  

        
        }
      }*/


    // The 'Sub Sub' objects
    }else{


      // Which chunk

      int index = int( ( vUv.x - (5.* size) ) / size );

      float chunk = floor( float( index / 4) );

      float lookup = (chunk * size) + size;

      vec4 otherPos = texture2D( t_pos , vec2( lookup , vUv.y ) );

      vec3 attract = springForce( otherPos.xyz , pos.xyz , springDistance3 );

      force += 3.5 * attract;

      int indexInChunk = index - int( chunk * 4. );

      /*for( int i = 0; i < 4; i++ ){

        if( (i - indexInChunk) != 0 ){

          float lookup = (float(i) * size) + (size*4. + hSize) + (chunk * 4. * size);

          vec4 otherPos = texture2D( t_pos , vec2( lookup , vUv.y ) );

          vec3 attract = springForce( pos.xyz , otherPos.xyz  , springDistance3  * 10.);

          force += .2 * attract ;           
        }

      }*/


      
    }



  }

  
  vel += force;

  vel *= .9;

  vec3 p = pos.xyz + vel * .1; 

  gl_FragColor = vec4( p , life );


}

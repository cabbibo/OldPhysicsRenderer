uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_audio;
uniform sampler2D t_column;

uniform vec3 leader;
uniform float dT;

varying vec2 vUv;

const float maxVel = 1.;

const float size = 1. / 32.;
const float hSize = size / 2.;
const float interpolation = .5;
const float springLength = .1;


vec3 springForce( vec3 toPos , vec3 fromPos , float staticLength ){

  vec3 dif = fromPos - toPos;
  vec3 nDif = normalize( dif );
  vec3 balance = nDif * staticLength;

  vec3 springDif = balance - dif;

  return springDif;

}


void main(){


  vec4 pos = texture2D( t_pos , vUv.xy );
  vec4 oPos = texture2D( t_oPos , vUv.xy );

  vec3 vel = oPos.xyz - pos.xyz;

  vec3 totalForce = vec3( 0. );



  vec3 forceLeft = vec3( 0. );
  vec3 forceRight = vec3( 0. );
  vec3 forceUp = vec3( 0. );
  vec3 forceDown = vec3( 0. );
  vec3 forceVel = vec3( 0. );
  vec3 forceOut = vec3( 0. );

  float sLY = springLength * .01;
  float sLX = springLength * 10. * (vUv.y * vUv.y ) +.3;


  vec2 index = vec2( floor( vUv.x / size) , floor(vUv.y / size) );
  // Repel from all
  for( int i = 0; i < 32; i++ ){
    for( int j = 0; j <32; j++ ){

      if( int( index.x ) == i && int( index.y ) == j ){


      }else{

        vec2 lookup = vec2( float( i ) * size +hSize , float( j ) * size + hSize );
        vec4 posRepel = texture2D( t_pos , lookup );

        vec3 dif = pos.xyz - posRepel.xyz;

        if( length( dif ) < .5 ){
          //totalForce += normalize(dif) * 1.;
        }else{
          totalForce += .03 *( 1.-vUv.y) *  normalize(dif) / ( length( dif ) * length( dif ));// * .00001 ;
        }

      }

    }
  }




  if( vUv.x > size ){

    vec4 posL = texture2D( t_pos , vec2( vUv.x - size , vUv.y ) ); 
    forceLeft = springForce(  posL.xyz , pos.xyz , sLX );

  }else{

    vec4 posL = texture2D( t_pos , vec2( 1. - hSize , vUv.y ) ); 
    forceLeft = springForce(  posL.xyz , pos.xyz , sLX );

  }

  if( vUv.x < 1. - size ){

    vec4 posR = texture2D( t_pos , vec2( vUv.x + size , vUv.y ) ); 
    forceRight = springForce(  posR.xyz , pos.xyz , sLX  );

  }else{
    
    vec4 posR = texture2D( t_pos , vec2( hSize , vUv.y ) ); 
    forceRight = springForce(  posR.xyz , pos.xyz , sLX  );

  }


  if( vUv.y > size ){

    vec4 posU = texture2D( t_pos , vec2( vUv.x , vUv.y  - size) ); 
    forceUp = springForce(  posU.xyz , pos.xyz , sLY );

  }else{

    //vec4 posU = texture2D( t_pos , vec2( vUv.x , vUv.y  - size) ); 
    forceUp = springForce(  leader , pos.xyz , sLY ) * 1.;


  }

  if( vUv.y < 1. - size ){

    vec4 posD = texture2D( t_pos , vec2( vUv.x , vUv.y + size ) ); 
    forceDown = springForce(  posD.xyz , pos.xyz , sLY );

  }




  totalForce += forceLeft   * interpolation;
  totalForce += forceRight  * interpolation;
  totalForce += forceUp     * interpolation;
  totalForce += forceDown   * interpolation;
  totalForce += forceVel    * interpolation;
  //totalForce -= forceVel    * interpolation;
  //totalForce += vec3( 0. , 0. , -.01 );

  if( length( totalForce ) > maxVel ){

    totalForce = normalize( totalForce ) * maxVel;

  }


  vec3 p = pos.xyz + totalForce * .45; //* dT ; 

  gl_FragColor = vec4( p , 1. );


}

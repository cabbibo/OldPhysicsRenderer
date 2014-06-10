uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_audio;

uniform vec3 leader;
uniform float dT;

varying vec2 vUv;

const float maxVel = 10.;

const float size = 1. / 32.;
const float hSize = size / 2.;

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

  vec3 force = vec3( 0. );


  float nextX = vUv.x + size;
  float nextY = vUv.y + size;
  float prevX = vUv.x - size;
  float prevY = vUv.y - size;

  if( vUv.x < size ){

    prevX = 1.0  - hSize;

  }else if( vUv.x > 1. - size ){

    nextX = hSize;

  }


  vec4 nextPosX = texture2D( t_pos , vec2( nextX , vUv.y ) );
  vec4 prevPosX = texture2D( t_pos , vec2( nextX , vUv.y ) );

  force += springForce( nextPosX.xyz , pos.xyz , 20. );
  force += springForce( prevPosX.xyz , pos.xyz , 20. );


 /* if( vUv.y > size ){

    prevY = 1.0  - hSize;

  }else if( vUv.y > 1. - size ){

    nextY = hSize;

  }
*/



/*
  vec4 nextPosX = texture2D( t_pos , vec2( nextX , vUv.y ) );
  vec4 prevPosX = texture2D( t_pos , vec2( nextX , vUv.y ) );

  //force += vec3( vUv.x , vUv.y , 0. );
  //force += springForce( nextPosY.xyz , pos.xyz , 20. );
  //force += springForce( prevPosY.xyz , pos.xyz , 20. );*/
  /*
  vec3 difNextX = nextPosX.xyz - pos.xyz;

  if( nextY < 1. ){
    vec4 nextPosY = texture2D( t_pos , vec2( vUv.x , nextY ) );

  }
  //vec4 nextPosX = texture2D( t_pos , vec2( nextX , vUv.y ) );
  //vec4 nextPosX = texture2D( t_pos , vec2( nextX , vUv.y ) );

  */
  vel += force * .1;//10000. * dT; //* dT;

  vel *= .9;

  if( length( vel ) > maxVel ){

    vel = normalize( vel ) * maxVel;

  }

  vec3 p = pos.xyz + vel; //* 10000. * dT ; 

  gl_FragColor = vec4( p , 1. );


}

uniform sampler2D t_vel;
uniform sampler2D t_pos;
uniform sampler2D t_audio;

uniform float cameraAngle;
uniform float time;
uniform float delta;

uniform vec3 uPos;
uniform vec3 uVel;

varying vec2 vUv;


vec3 velSphere( vec3 c , float r , vec3 p , vec3 v ){

  vec3 d = (p +v*delta)- c;

  float l = length ( d );

  float vL = length( v );
  vec3 refl = reflect( normalize( v ) , normalize( d ) );

  vec3 finalVel = v;

  if( l < r ){
    finalVel = refl * vL * .9;
  }

  return ( finalVel );


}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

$simplex
$curl

void main(){
  

  vec4 vel = texture2D( t_vel , vUv );
  vec4 pos = texture2D( t_pos , vUv );
  vec4 a   = texture2D( t_audio , vec2( vUv.x , 0.0 ) );
  

  if( pos.xyz == uPos ){

    vel.xyz = vec3(uVel);
    //vel.xyz = uVel;//* rand( vUv );
  }

  vec3 c = curlNoise( pos.xyz  * .01 );

  if( vel.y < -20. ){
    vec3 refl = reflect( vec3( 0. , 1. , 0. ) , normalize(vel.xyz) );
    vel.xyz = refl * length( vel.xyz );
    //vel.xyz *= 1.;
  }

  vel.xyz *= .9 + ( a.x * .1);

  //vel.xyz *= .95;
  gl_FragColor = vec4( vel.xyz  , vel.w );





}


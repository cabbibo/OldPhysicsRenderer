uniform sampler2D t_vel;
uniform sampler2D t_pos;
uniform sampler2D t_audio;

uniform float cameraAngle;
uniform float time;
uniform float delta;

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
  

  if( pos.y == 20. ){

    float angle = cameraAngle - ( 3.14159 );
    vec3 dir = vec3( cos(angle) , 0.0 , sin(angle ) );
    vel.xyz = vec3( rand( vUv.xy )-.5 , 0. , rand( vUv.yx)-.5)*10. + dir *20. ;
  }


  vel.y -= .2; 
  vel.x -= pos.x / 100.;
  vel.z -= pos.z / 100.;

  vec3 center = vec3( 0. , 0. , 0. );
  float radius = 5.;

  vel.xyz = velSphere( center , radius , pos.xyz , vel.xyz );

  center = vec3( 5. , -5. , -5. );
  radius = 5.;
  vel.xyz = velSphere( center , radius , pos.xyz , vel.xyz );

  center = vec3( 5. , -5. , 5. );
  radius = 5.;
  vel.xyz = velSphere( center , radius , pos.xyz , vel.xyz );
  center = vec3( -5. , -5. , -5. );
  radius = 5.;
  vel.xyz = velSphere( center , radius , pos.xyz , vel.xyz );
  center = vec3( -5. , -5. , 5. );
  radius = 5.;
  vel.xyz = velSphere( center , radius , pos.xyz , vel.xyz );

 // vel.xyz ;

  vec3 c = curlNoise( pos.xyz  * .1 );


  gl_FragColor = vec4( vel.xyz *( .9 + a.w*.1) + c*.1 , vel.w );



}


uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_audio;
//uniform sampler2D t_column;

uniform vec3 leader;
uniform float dT;
uniform float timer;

varying vec2 vUv;


vec3 cubicCurve( float t , vec3  c0 , vec3 c1 , vec3 c2 , vec3 c3 ){
  
  float s  = 1. - t; 

  vec3 v1 = c0 * ( s * s * s );
  vec3 v2 = 3. * c1 * ( s * s ) * t;
  vec3 v3 = 3. * c2 * s * ( t * t );
  vec3 v4 = c3 * ( t * t * t );

  vec3 value = v1 + v2 + v3 + v4;

  return value;

}


void main(){


  vec4 pos = texture2D( t_pos , vUv.xy );
  vec4 oPos = texture2D( t_oPos , vUv.xy );

  vec3 vel = pos.xyz - oPos.xyz;

  float x = floor(vUv.x *4.);

  float y = vUv.y;
  y *= 4.;
  y = floor( y );

  float slice = ((vUv.y * 4.) - y);
  y += vUv.x*4.;

  vec3 toPos = vec3( x * 100. + 40. * cos( slice * timer )  , y * 100. + 40.*sin( slice * timer ) , slice * 100.4);



  gl_FragColor = vec4( toPos , 1. );



}

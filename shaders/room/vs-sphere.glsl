
uniform vec3 uVel;
uniform vec3 uPos;
uniform sampler2D t_audio;
uniform float audioLookup;


varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vVel;

varying float vMatch;
varying vec4 vAudio;
varying vec4 vAudioMatch;
varying vec4 vAudioNormal;


void main(){


  vec3 pos = position;

  float match = dot( normalize( normal ) , normalize( vec3( .0 , -1. , 0.) + .9 *uVel  ) );

  //float match = dot( normalize( normal ) , normalize( uVel  ) );

  vMatch = match;

  vAudio = texture2D( t_audio , vec2( audioLookup * .5 , 0.0 ) );
  vAudioMatch = texture2D( t_audio , vec2( (match + 1. )/2. , 0.0 ) );
  vAudioNormal = texture2D( t_audio , vec2( -1. * match  , 0.0 ) );

  float uberMatch = match * match * match * match * match;
  pos += 10. * normalize(pos) * length(pos) *vAudioNormal.x*vAudioNormal.y;
  pos *= .2 - 2.0 *  uberMatch;
 // pos *= 20. * vAudioNormal.xyz*match*match*match;
  //pos *=vAudioMatch.x * vAudio.x * vAudio.x * 30.*length( uVel )*match*match*match*match*match* match*match*match*match;
  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );

  gl_Position = projectionMatrix * mvPos;



}

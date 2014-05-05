

uniform vec3 uVel;
uniform vec3 uPos;

varying vec3 vNorm;
varying vec3 vPos;
varying vec3 vVel;

varying float vMatch;
varying vec4 vAudio;
varying vec4 vAudioMatch;
varying vec4 vAudioNormal;
void main(){


  if( vMatch > 0.0 ){
  discard;
  }

  vec3 c =vec3( vAudioMatch.x , 0. , sin( vAudioMatch.y * 10. ));
  vec3 c2 = c * vec3( 1.0 , .5 , 0.0 );
  gl_FragColor= vec4( c2 , vAudioMatch.w + .9 );

}

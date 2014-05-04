

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


  gl_FragColor= vec4( vAudioMatch.x , 0. , sin( vAudioMatch.y * 10. )  , vAudioMatch.w*.9 );

}

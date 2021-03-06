uniform sampler2D t_pos;
uniform sampler2D t_vel;
uniform sampler2D t_audio;

varying vec4 vVel;
varying vec4 vPos;
varying vec4 vAudio;

varying vec2 vUv;

void main(){

  vUv = position.xy;

  vPos =  texture2D( t_pos , position.xy );
  vVel = texture2D( t_vel , position.xy );
  vAudio = texture2D( t_audio , vec2( position.x , 0. ) );

  vec3 pos = vPos.xyz;

  
  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );

  gl_PointSize = abs(normalize( vVel.xyz ).y) * 10. * vAudio.x* vAudio.x* vAudio.x;
  gl_Position = projectionMatrix * mvPos;

}

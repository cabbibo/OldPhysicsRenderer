uniform sampler2D t_pos;
uniform sampler2D t_oPos;

varying vec4 vOPos;
varying vec4 vPos;

varying vec2 vUv;

void main(){

  vUv = position.xy;

  vPos =  texture2D( t_pos , position.xy );
  vOPos = texture2D( t_oPos , position.xy );

  vec3 pos = vPos.xyz;
  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );
  gl_Position = projectionMatrix * mvPos;

}

uniform sampler2D lookup;

varying vec3 vPos;
varying float vC;

void main(){

  vPos =  texture2D( lookup , position.xy ).xyz;

  vC = position.z ; 
  //vPos = position;
  vec4 mvPos = modelViewMatrix * vec4( vPos , 1.0 );
  gl_Position = projectionMatrix * mvPos;
  


}

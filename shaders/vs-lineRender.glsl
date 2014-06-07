uniform sampler2D lookup;


attribute vec3 color;

varying vec3 vPos;
varying float vC;

varying vec3 vColor;

void main(){

  vPos =  texture2D( lookup , position.xy ).xyz;

  vColor = color;
  vC = position.z ; 
  //vPos = position;
  vec4 mvPos = modelViewMatrix * vec4( vPos , 1.0 );
  gl_Position = projectionMatrix * mvPos;
  


}

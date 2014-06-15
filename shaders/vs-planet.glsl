
uniform vec3 lightPos;
uniform float time;


varying vec3 vPos;
varying vec2 vUv;
varying vec3 vNorm;
varying vec3 vView;

varying mat3 vNormalMat;
varying vec3 vLightDir;
varying float vDisplacement;

$simplex

void main(){

  vPos  = position;
  vNorm = normal;
  vUv   = uv;

  vView = modelViewMatrix[3].xyz;
  vNorm = normalMatrix *  normal ;
  vNormalMat = normalMatrix;

  vec3 lightDir = normalize( lightPos -  (modelViewMatrix * vec4( vPos , 1.0 )).xyz );
  vLightDir = lightDir;

  vec3 offset = vec3( time * .1 , time * .13 , time * .15 );
  vDisplacement = snoise( normalize(vPos) * 2. + offset );

  vPos *= 1. + vDisplacement *.1;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );

}

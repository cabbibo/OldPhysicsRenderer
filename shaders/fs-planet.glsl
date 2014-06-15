
uniform vec3 lightPos;
uniform float time;
uniform sampler2D tNormal;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;

varying vec2 vUv;
varying vec3 vNorm;
varying vec3 vPos;

varying mat3 vNormalMat;
varying vec3 vLightDir;
varying vec3 vLightPos;
varying vec3 vView;

varying float vDisplacement;
  
$simplex

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


  vec3 tNorm = texture2D( tNormal , vUv ).xyz;
  tNorm = normalize( tNorm  ) * 1.;
  
  vec3 newNormal = normalize( vNorm + tNorm );

  vec3 nNormal = normalize( vNormalMat * newNormal  );
  vec3 nView = normalize(vView);
  vec3 nReflection = normalize( reflect( vView , nNormal )); 

  vec3 refl = reflect( vLightDir , nNormal );
  float facingRatio = abs( dot(  nNormal, refl) );

  float newDot = dot( normalize( nNormal ), nView );
  float inverse_dot_view = 1.0 - max( newDot  , 0.0);

  vec3 p1 = color1;
  vec3 p2 = color2;
  vec3 p3 = color3;
  vec3 p4 = color4;
  
  vec3 v1 = vec3(0.);
  vec3 v2 = .2  * p1-p3;
  vec3 v3 = .5  * p2-p4;
  vec3 v4 = vec3(0.);

  vec3 c1 = p1;
  vec3 c2 = p2 + v1/3.;
  vec3 c3 = p3 - v2/3.;
  vec3 c4 = p4;

   vec3 lookup_table_color = cubicCurve( inverse_dot_view * facingRatio , c1 , c2 , c3 , c4 );

 // float noise = snoise( normalize(vPos) );
  gl_FragColor = vec4( lookup_table_color * (vDisplacement*.3+.7)  , 1.0 );

}


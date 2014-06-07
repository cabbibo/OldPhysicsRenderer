
uniform sampler2D t_audio;

varying float vC;
varying vec3 vColor;
varying vec3 vPos;
varying vec3 vVel;
varying vec3 vNorm;

varying vec3 vView;
varying vec3 vLightDir;


void main(){

  vec3 nNormal = vNorm;

  vec3 nReflection = normalize( reflect( vView , nNormal )); 

  float nViewDot = dot( normalize( nNormal ), normalize( vView ) );
  float iNViewDot = 1.0 - max( nViewDot  , 0.0);
  
  vec3 refl = reflect( vLightDir , nNormal );
  float facingRatio = abs( dot(  nNormal, refl) );

  vec4 aColor = texture2D( t_audio , vec2( iNViewDot * facingRatio , 0.0));


  gl_FragColor = vec4( aColor.xyz * .9 + vColor * .5 , 1.0 );

}

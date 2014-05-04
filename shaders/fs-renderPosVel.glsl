uniform sampler2D t_audio;
uniform sampler2D sprite;
varying vec2 vUv;

varying vec4 vPos;
varying vec4 vVel;
varying vec4 vAudio;

void main(){

  float y = smoothstep( -5.0 , 5. ,  vVel.y );

  vec4 s = texture2D( sprite , vec2( gl_PointCoord.x , 1.0 - gl_PointCoord.y) );

  vec2 sample = vec2( abs( vPos.y / 20. ) , 0.0 );
  vec4 a = texture2D( t_audio , sample );

  float newY = vVel.y * -1.;
  vec3 vNorm = normalize( vVel.xyz + vec3( 0. , newY* .99 , 0. ) );
 // vNorm = normalize( vPos.xyz );

  vec3 c1 = y * normalize(abs(sin( vNorm * 20. ) ) + abs(sin( vNorm * 20.2 ) ));
  vec3 c2 = vec3( .5 , .5 , .5 );

  vec3 newC = smoothstep( c1 , c2 , abs(vNorm) );
  vec3 finalC = normalize( vec3( .8 , .2 , 1.9 ) + newC );
  gl_FragColor = vec4( normalize( vec3( s.x * (.9 + (.5 * vUv.x) ) , s.yz*  ((finalC + vAudio.xyz*.6) -.4).xy)) , s.x );




}


varying vec3 vNormal;
varying vec2 vUv;
varying float vSlice;
varying float vAmount;
varying vec3 vTest;
varying float vHead;

void main(){

  //gl_FragColor = vec4( vAmount , 0. , vSlice / 16. , 1. );

  vec3 test =  ( vTest * vAmount);

  vec3 c = vNormal * .75 + (vHead * .25);
  gl_FragColor = vec4( c , 1. );

}

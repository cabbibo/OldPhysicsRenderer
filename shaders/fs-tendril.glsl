
varying vec3 vNormal;
varying vec2 vUv;
varying float vSlice;
varying float vAmount;
varying vec3 vTest;

void main(){

  //gl_FragColor = vec4( vAmount , 0. , vSlice / 16. , 1. );

  gl_FragColor = vec4( vTest * vAmount , 1. );

}

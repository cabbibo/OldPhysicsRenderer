
varying vec3 vNormal;
varying vec2 vUv;
varying float vSlice;
varying float vAmount;

void main(){

  gl_FragColor = vec4( vAmount  , vNormal.z  , vSlice / 16. , 1. );

}

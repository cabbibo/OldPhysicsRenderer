uniform sampler2D t_pos;
uniform sampler2D t_oPos;

varying vec4 vOPos;
varying vec4 vPos;

varying vec2 vUv;

const float size = 1. / 32.;
const float hSize = size / 2.;

void main(){

  vUv = position.xy;

  vPos =  texture2D( t_pos , position.xy );
  vOPos = texture2D( t_oPos , position.xy );

  vec3 pos = vPos.xyz;
  vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );

  float mIx = floor( (vUv.x + hSize ) / size );
  float mIy = floor( (vUv.y + hSize) / size );

  // Main Index
  vec2 mI = vec2( mIx , mIy );
 
  if( mI.x < 1. ){
    gl_PointSize = 20.;
  }else{

    if( vUv.x < size * 5. - hSize ){

      gl_PointSize =  10. ;   

    }else{

      gl_PointSize = 5.;
    }

  }

  gl_Position = projectionMatrix * mvPos;

}

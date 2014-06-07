
uniform sampler2D t_audio;
uniform sampler2D t_sprite;

varying vec2 vUv;
varying vec4 vPos;

const float size = 1. / 32.;
const float hSize = size / 2.;

void main(){


  float mIx = floor( (vUv.x + hSize ) / size );
  float mIy = floor( (vUv.y + hSize) / size );

  // Main Index
  vec2 mI = vec2( mIx , mIy );

  vec3 c = vec3( 0. );

  if( mI.x < size ){
    c.r = 1.3;
    c.r = .6;
    c.r = .3;
  }else{

    if( vUv.x < size * 5. + hSize ){

      c.r = .6; 
      c.g = .2;
      c.b = 1.3;
    
    }else if( vUv.x < size * 20. + hSize ) {
      c.r = .3;
      c.g  = 1.4;
      c.g  = .9;

    }else{

      c.r = 1.3;
      c.g = .6;
      c.b = .4;
      //discard;

    }

  }

  vec4 s = texture2D( t_sprite , vec2( gl_PointCoord.x , 1.0 - gl_PointCoord.y) );
  vec4 a = texture2D( t_audio , vec2( vUv.y , 0.0 ));

  if( s.a < .5 ){

    //discard;

  }
  //float c = mod(( vUv.y -hSize ) / size , 2. );

  gl_FragColor = vec4( a.xyz * c , length( a.xyz ) * 1. * s.a * s.a ); 
}

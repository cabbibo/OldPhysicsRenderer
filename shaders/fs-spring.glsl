
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
    c.r = 1.;
  }else{

    if( vUv.x < size * 5. + hSize ){

      c.b = 1.;
      c.r =  vPos.w;
      c.g = mod(( vUv.y + hSize) / size , 2. );
      

    }else{

     // c.r = 1.;
      c.g  = .4;

      c.b = mod(( vUv.y + hSize) / size , 2. ) - .5;
      
   
    }

  }

  //float c = mod(( vUv.y -hSize ) / size , 2. );

  gl_FragColor = vec4( c , 1.0 ); 
}

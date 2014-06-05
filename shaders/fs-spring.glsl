
varying vec2 vUv;
varying vec4 vPos;

const float size = 1. / 21.;
const float hSize = size / 2.;

void main(){



  vec3 c = vec3( 0. );

  if( vUv.x < size + hSize ){
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

  gl_FragColor = vec4( c , 1.0 ); 
}

  
  uniform samplerCube tReflection;
  uniform sampler2D   tIri;
  uniform sampler2D   tNoise;
  uniform sampler2D tNormal;
  uniform sampler2D t_audio;
  uniform vec3 lightPos;
  
  uniform vec3 color1;
  uniform vec3 color2;
  uniform vec3 color3;
  uniform vec3 color4;
 
  uniform float time;

  varying vec3 vPos;
  varying float fr;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec2 vUv;
  varying float vDisplacement;

  varying vec3 vLightDir;
  varying vec3 vLightPos;
  varying mat3 vNormalMat;

  const float noise_strength = .2;
  
  $simplex
  
  float fractNoise( vec2 v ){

    vec2 value = vec2( abs(v.x - .5 ) * 2. , abs( v.y - .5 ) * 2. );
    
    float s1 = snoise( value * .9  + vec2(  time * 3. , time * .2 ));
    float s2 = snoise( value * 2.9 + vec2( time * .4  , time * .9 ))*.5;
    float s3 = snoise( value * 5.9 + vec2(  time * 1. , time * .56 ))*.2;
    float s4 = snoise( value * 20.09+ vec2( time * .8 , time * 1.1 ) )*.01;
    float s5 = snoise( value * 10.9 + vec2(  time * 2., time * 4.0 ))*.04;

    return s1+s2+s3+s4+s5;

  }

 
  vec3 cubicCurve( float t , vec3  c0 , vec3 c1 , vec3 c2 , vec3 c3 ){
  
    float s  = 1. - t; 

    vec3 v1 = c0 * ( s * s * s );
    vec3 v2 = 3. * c1 * ( s * s ) * t;
    vec3 v3 = 3. * c2 * s * ( t * t );
    vec3 v4 = c3 * ( t * t * t );

    vec3 value = v1 + v2 + v3 + v4;

    return value;

  }

  void main(void)  {


    vec3 tNorm = texture2D( tNormal , vUv ).xyz;

    tNorm = normalize( tNorm  ) * 1.;
    
    
    vec3 newNormal = normalize( vNormal + tNorm );

     vec3 nNormal = normalize( vNormalMat * newNormal  );
     vec3 nView = normalize(vView);
     vec3 nReflection = normalize( reflect( vView , nNormal )); 

   // float s1 = snoise( vUv * 50.1);
   // float s2 = snoise( vUv * 240.1);

      //fr = dot(vNormal, vWiew);							    //facing ratio

     vec3 refl = reflect( vLightDir , nNormal );
    float facingRatio = abs( dot(  nNormal, refl) );

      vec3 a1 = texture2D( t_audio , vec2( abs( nReflection.x ) , 0.0 ) ).xyz;
     vec3 a2 = texture2D( t_audio , vec2( abs( nReflection.y ) , 0.0 ) ).xyz;
     vec3 a3 = texture2D( t_audio , vec2( abs( nReflection.z ) , 0.0 ) ).xyz;

     vec3 aP = a1 + a2 + a3 ;

     float newDot = dot( normalize( nNormal ), nView );
     float inverse_dot_view = 1.0 - max( newDot  , 0.0);
     
     vec3 lookup_table_color = texture2D( tIri , vec2( inverse_dot_view * facingRatio , 0.0)).rgb;





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


    lookup_table_color = cubicCurve( inverse_dot_view * facingRatio , c1 , c2 , c3 , c4 );


     vec3 audioColor = texture2D( t_audio , vec2(  inverse_dot_view * facingRatio , 0. ) ).xyz;

     vec3 halfv = normalize( vLightDir + nView ); 
     float specDot = max( 0. , dot( nNormal , halfv ));
     float specularity = pow( specDot , 50. );

     vec3 sC = vec3( 1. , 1. , 1. ) * specularity;




     gl_FragColor.rgb = lookup_table_color * (vec3(.3) + audioColor*.7) +sC;
     gl_FragColor.a = 1.;//vDisplacement*.1 + .9;

    // gl_FragColor.rgb = color1;
     /*gl_FragColor += texture2D( tNormal , vUv );

     gl_FragColor = normalize( gl_FragColor );*/

     //gl_FragColor.rgb *= vec3( 2. , .7, 2. );//abs(nNormal);
  } 

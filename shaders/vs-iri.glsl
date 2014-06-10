
  uniform vec3 lightPos;
  uniform sampler2D tNormal;
  uniform float time;

  uniform sampler2D   tNoise;
  
  uniform sampler2D t_pos;
  uniform sampler2D t_oPos;
  uniform sampler2D t_ooPos;
  

  varying vec3 vView;
  varying vec3 vNormal;
  varying vec2 vUv;
  varying vec3 vPos;

  varying float fr;

  varying mat3 vNormalMat;
  varying vec3 vLightDir;
  varying float vDisplacement;


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


  vec3 newCoord( vec3 pos, vec2 value ){

    float displace = fractNoise( value );


    return pos + vec3( 0. , 0. , (( displace * .03 ) + 1. ) );

  }
  
  void main(void)
  {

    vec3 pos = texture2D( t_pos , position.xy ).xyz;
    vPos = pos;
    
    //vPos = position.xyz;
    vUv = position.xy;

    
    //vec3 actual = newCoord( pos , vUv );

   // vec3 tPos = texture2D( tNoise , position.xy ).xyz;
    //vec3 nPos = normalize( vec3( position.xy , length( tPos )));



    //normal = nPos;

   // vDisplacement = fractNoise( vUv ) * 4.;

    //float distanceToEdge = pow( (.5 -  abs(vUv.x - .5 ) ) * (.5 -  abs(vUv.y - .5 ) ) , .5 );

    //vPos = nPos;
   // vPos = position;// + normal * vDisplacement * distanceToEdge * 4.;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );
    vUv = uv;
    vPos = position;
    vView = modelViewMatrix[3].xyz;
    vNormal = normalMatrix *  normal ;
    vNormalMat = normalMatrix;

    vec3 lightDir = normalize( lightPos -  (modelViewMatrix * vec4( vPos , 1.0 )).xyz );

    vLightDir = lightDir;
    vec3 refl = reflect( lightDir , vNormal );
    fr = dot(  vNormal, refl);							    //facing ratio
    
  }
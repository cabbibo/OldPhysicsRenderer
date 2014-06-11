
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

    const float size = 1. / 32.;
  const float hSize = size / 2.;


    
  void main(void)
  {

   // vec3 pos = texture2D( t_pos , position.xy ).xyz;
    //vPos = pos;
    
    //vPos = position.xyz;
   // vUv = position.xy;

    vec3 pos = texture2D( t_pos , position.xy ).xyz;

    vPos = pos;
    vUv = position.xy;
    
    vec2 uvL = vUv;
    uvL.x -= size;
    if( uvL.x < 0. ){
        uvL.x = 1. - hSize;
    }
    vec4 posL = texture2D( t_pos , uvL ); 

    vec2 uvR = vUv;
    uvR.x += size;

    if( uvR.x > 1. ){
        uvR.x = 0. + hSize;
    }
    vec4 posR = texture2D( t_pos , uvR ); 
     
    
    vec2 uvU = vUv;
    uvU.y -= size;
    if( uvU.y < 0. ){
        uvU.y = vUv.y;
    }
    vec4 posU = texture2D( t_pos , uvU ); 

    vec2 uvD = vUv;
    uvD.y += size;

    if( uvD.y > 1. ){
        uvD.y = vUv.y;
    }
    vec4 posD = texture2D( t_pos , uvD ); 


    vec3 difX = posL.xyz - posR.xyz;
    vec3 difY = posD.xyz - posU.xyz;

    vec3 normal = normalize( cross( difX , difY ) );
    
    //vec3 actual = newCoord( pos , vUv );

   // vec3 tPos = texture2D( tNoise , position.xy ).xyz;
    //vec3 nPos = normalize( vec3( position.xy , length( tPos )));



    //normal = nPos;

   // vDisplacement = fractNoise( vUv ) * 4.;

    //float distanceToEdge = pow( (.5 -  abs(vUv.x - .5 ) ) * (.5 -  abs(vUv.y - .5 ) ) , .5 );

    //vPos = nPos;
   // vPos = position;// + normal * vDisplacement * distanceToEdge * 4.;

    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );
    //vUv = uv;
    vPos = position;
    vView = modelViewMatrix[3].xyz;
    vNormal = normalMatrix *  normal ;
    vNormalMat = normalMatrix;

    vec3 lightDir = normalize( lightPos -  (modelViewMatrix * vec4( vPos , 1.0 )).xyz );

    vLightDir = lightDir;
    vec3 refl = reflect( lightDir , vNormal );
    fr = dot(  vNormal, refl);							    //facing ratio
    
  }

uniform sampler2D t_oPos;
uniform sampler2D t_pos;
uniform sampler2D t_audio;
uniform sampler2D t_og;

uniform float dT;
uniform float timer;

uniform vec3 flow;

uniform vec3 repelPoint;
uniform float repelRadius;
uniform float xySpacing;
uniform float springDistance;

varying vec2 vUv;

const float maxVel = 20.0;

const vec3 floating = vec3( 0. , 0. , 1. );

vec3 cubicCurve( float t , vec3  c0 , vec3 c1 , vec3 c2 , vec3 c3 ){
  
  float s  = 1. - t; 

  vec3 v1 = c0 * ( s * s * s );
  vec3 v2 = 3. * c1 * ( s * s ) * t;
  vec3 v3 = 3. * c2 * s * ( t * t );
  vec3 v4 = c3 * ( t * t * t );

  vec3 value = v1 + v2 + v3 + v4;

  return value;

}

vec3 springForce( vec3 p1 , vec3 p2 , float dist ){

  vec3 dif = p2 - p1;

  vec3 norm = normalize( dif );

  float l = length( dif );

  float springDif = l - dist;

  vec3 force = norm * springDif;

  return force;




}


const float size = 1. / 64.;
const float size4 = size * 4.;


void main(){


  vec3 pos = texture2D( t_pos , vUv.xy ).xyz;
  vec3 oPos = texture2D( t_oPos , vUv.xy ).xyz;
  vec3 ogPos = texture2D( t_og , vUv.xy ).xyz;

  float column = vUv.x;

  vec3 vel = pos.xyz - oPos.xyz;

  float preX = (vUv.x * 16.);
  float x = floor(vUv.x *16.);

  float y = vUv.y;
  y *= 4.;
  y = floor( y );

  float slice = ((vUv.y * 4.) - y);

  y += preX - x ;
  x /= 4.;
  
  float z = slice;

  z *= 50.;
  
  y *= 10.;
  x *= 10.;

  vec3 newPos = pos;

  vec3 force = vec3( 0. );

  // The Base Position
  if( slice <= size4 ){

    newPos = ogPos;


    //force += flow * 10.;

  // The tip Position
  }else if( slice >= 1. - size4 ){

    vec3 posDown = texture2D( t_pos , vUv.xy - vec2( 0. , size ) ).xyz;
   
    //vec3 difDown = posDown - pos;
   // force += difDown/12.;
   
    force += springForce( pos , posDown , 1. ) * 10.;

    vec3 dif = ogPos - pos;

   // force += normalize( dif ) * 30.;
 
    force += flow * slice * 1.;

    force += floating * 10.;

    vec3 repelDif = repelPoint - pos;

    float repelLength = length( repelDif );

    if( repelLength < repelRadius ){
      force -= normalize( repelDif ) * 100.;
    }

    //gl_FragColor = vec4( posDown , 1. );

  // Middle Positions
  }else{

    vec3 posDown = texture2D( t_pos , vUv.xy - vec2( 0. ,  size ) ).xyz;
    vec3 posUp = texture2D( t_pos , vUv.xy + vec2( 0. , size ) ).xyz;

    force += springForce( pos , posDown , 1. ) * 10.;
    force += springForce( pos , posUp , 1. ) * 10.;
    
    //force += springForce( pos , posDown , 0. ) * 10.;
   // force += springForce( pos , posUp , 10. ) * 100.;

    gl_FragColor = vec4( posDown , 1. );
    vec3 dif = ogPos - pos;

    //force += normalize( dif ) * 30.;


//    vec3 columnDif = vec3( x , y , 0 ) - pos;
   // force += vec3( columnDif.xy * 10. , 0. )*10.;
    force += flow * slice * 1.;

    force += floating* 10.;

    vec3 repelDif = repelPoint - pos;

    float repelLength = length( repelDif );

    if( repelLength < repelRadius ){
      force -= normalize( repelDif ) * 100.;
    }

  }

 
  if( slice <= size4 ){ 

    gl_FragColor = vec4( newPos , 1. );

  }else{

     vel += force * 10. * dT;
    //vel *= .97;

    if( length( vel ) > maxVel ){

      vel = normalize( vel ) * maxVel;

    }
    
    newPos = pos + vel * dT;

    gl_FragColor = vec4( newPos , 1. );

  }



}

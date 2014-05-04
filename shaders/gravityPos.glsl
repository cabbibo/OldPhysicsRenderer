uniform sampler2D t_vel;
uniform sampler2D t_pos;
uniform sampler2D t_audio;
uniform sampler2D t_start;
uniform float delta;

//uniform vec3 spherePos;

varying vec2 vUv;

vec4 posSphere( vec3 center , float r , vec3 p , vec3 v ){

// The line passes through p1 and p2:
vec3 p2 = p + v*delta;
vec3 p1 = p;

// Sphere center is p3, radius is r:
vec3 p3 = center;

vec3 d = p2 - p1;

float a = dot(d, d);
float b = 2.0 * dot(d, p1 - p3);
float c = dot(p3, p3) + dot(p1, p1) - 2.0 * dot(p3, p1) - r*r;

float test = b*b - 4.0*a*c;

if (test >= 0.0) {
  // Hit (according to Treebeard, "a fine hit").
  float u = (-b - sqrt(test)) / (2.0 * a);
  vec3 hitp = p1 + u * (p2 - p1);
  // Now use hitp.

  return vec4( hitp , 1.0 );
}else{
  return vec4( 0.0, 0.0 , 0.0 , 0.0 );
}

}

/*vec3 velSphere( vec3 center , vec3 hitPoint , vec3 vel , vec3 pos ){

  vec3 d = hitPoint - center;

  float vL = length( vel * delta );
  float pDif = length( hitPoint - pos );

  vec3 refl = reflect( normalize( vel ) , normalize(d ) );

  vec3 vFinal = (pDif - vL) * refl; 

  return vFinal;

}*/

vec3 velSphere( vec3 c , float r , vec3 p , vec3 v ){

  vec3 d = (p+v*delta) - c;

  float l = length ( d );

  float vL = length( v );
  vec3 refl = reflect( normalize( v ) , normalize( d ) );

  vec3 finalVel = v;

  if( l < r ){
    finalVel = refl * vL;
  }

  return ( finalVel );


}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}




void main(){
  

  vec4 vel = texture2D( t_vel , vUv );
  vec4 pos = texture2D( t_pos , vUv );
  vec4 a   = texture2D( t_audio , vec2( vUv.x , 0.0 ) );

  if( pos.y < -20.0 ){


    pos.xyz = texture2D( t_start , vUv ).xyz;
    pos.y = 20.;
    vel.xyz = vec3(0. , 0. , 0. );
    pos.w = 0.0;

  }

  if( pos.w > 50. ){

    pos.xyz = texture2D( t_start , vUv ).xyz;
    pos.y = 20.;
    vel.xyz = vec3(0.,0.,0.);
    pos.w = 0.0;

  }

  pos.w += delta;


  vec3 center = vec3( 0. , 0. , 0. );
  float radius = 10.;
  vec4 hitPoint = posSphere( center , radius , pos.xyz , vel.xyz );
  //vec3 hitVel   = velSphere( center , hitPoint.xyz , vel.xyz , pos.xyz );
  vec3 hitVel   = velSphere( center , radius , pos.xyz , vel.xyz );

  vec3 finalPoint = pos.xyz + vel.xyz * delta * ( a.w );
  /*if( hitPoint.w != 0. ){
    finalPoint = hitPoint.xyz+10.0*hitVel*delta;
  }*/
  gl_FragColor = vec4( finalPoint , pos.w );



}


uniform float time;
uniform sampler2D t_audio;

varying vec3 vNormal;
varying vec4 vPosition;
varying vec4 vOPosition;
varying vec3 vONormal;
varying vec3 vU;
varying vec3 vEye;

varying float vDisplacement;

$simplex

void main() {

    vOPosition = modelViewMatrix * vec4( position, 1.0 );

    vec3 n1 = vec3( normal );
    float length = length( position.xy );
    vec4 audio = texture2D( t_audio , vec2( abs(sin(length / 10.)), 0.  ) );
     
    float noise = snoise( position.xy * .01 + vec2( time * 5.1 , time * 10. ) * .4  );
    float noise1 = snoise( position.xy * .2 + vec2( time * 2.5 , time * 5.1 ) * .01  );
    float noise2 = snoise( position.xy * .1 + vec2( time * 8.3 , time * 5.6 ) * .05  );

    vDisplacement = audio.x;
    //vec3 pos = position + vec3( 0.,0.,10. )* (.9 - (.1 * (noise+noise1+noise2 )));
    vec3 pos = position + vec3( 0.,0.,10. )* audio.x ;


    //pos *= vec3( 1.0 + (audio.x *.2) );
    vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );

    vOPosition = mvPos;

    gl_Position = projectionMatrix * mvPos;

    vU = normalize( vec3( modelViewMatrix * vec4( pos, 1.0 ) ) );

    vPosition = vec4( pos, 1.0 );
    vNormal = normalMatrix * normalize( audio.xyz );//normal;
    vONormal = normalize( audio.xyz );//normal;


}

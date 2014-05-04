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
     
    float noise = snoise( position.xz * .1 + vec2( time * .1 , time * .2 ) * .4  );

    vDisplacement = noise;
    vec3 pos = position.xyz * (.9 - (.1 * noise ));

    vec4 audio = texture2D( t_audio , vec2( sin(uv.x*noise) , 0.  ) );
    vec4 audioY = texture2D( t_audio , vec2( sin(uv.y*noise) , 0.  ) );

    pos *= vec3( 1.0 + (audio.x *.1) + audioY.x *.1);
    vec4 mvPos = modelViewMatrix * vec4( pos , 1.0 );

    vOPosition = mvPos;

    gl_Position = projectionMatrix * mvPos;

    vU = normalize( vec3( modelViewMatrix * vec4( pos, 1.0 ) ) );

    vPosition = vec4( pos, 1.0 );
    vNormal = normalMatrix * normalize( audio.xyz + audioY.xyz );//normal;
    vONormal = normalize( audio.xyz + audioY.xyz );//normal;


}

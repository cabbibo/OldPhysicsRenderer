
  uniform sampler2D t_pos;

  varying vec3 vPos;
  varying vec2 vUv;

  void main()
  {

    vec3 pos = texture2D( t_pos , position.xy ).xyz;

    vPos = pos;
    vUv = position.xy;
    

    gl_Position = projectionMatrix * modelViewMatrix * vec4( vPos , 1.0 );
    

  }

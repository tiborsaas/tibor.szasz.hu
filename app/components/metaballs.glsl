#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;

void main()
{
	float c = cos(u_time),
    s = sin(u_time),
    uvScale = 1.0;

  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	uv.y *= u_resolution.y / u_resolution.x;
	uv.x = mix(-1. * uvScale, uvScale, uv.x);
	uv.y = mix(-1. * uvScale, uvScale, uv.y);

  vec2 metaballs[4];
	metaballs[0] = vec2(sin(u_time * 0.5) * .5 - .23, abs(s * 0.5) - 1.);
	metaballs[1] = vec2(cos(u_time*0.7) * .4 + .1, abs(sin(u_time * .25)) * .9 - 1.);
	metaballs[2] = vec2(sin(u_time * 1.33) * .3,cos(u_time * 1.3)* .3 - .8);
	metaballs[3] = vec2(c*.5, abs(s*.9 * s*.3) - 1.);

  vec4 ballCol = vec4(
      .04 / pow(distance(uv, metaballs[0]), 2.0)
    + .01 / pow(distance(uv, metaballs[1]), 2.0)
    + .13 / pow(distance(uv, metaballs[2]), 2.0)
    + .03 / pow(distance(uv, metaballs[3]), 2.0)
	);

  vec3 oldcolor = ballCol.xyz * texture2D(u_tex0, (mod(gl_FragCoord.yx, 8.0) / 8.0)).xyz;
  vec3 dithered = floor( vec3(oldcolor.x, oldcolor.x, oldcolor.x) );
  gl_FragColor = vec4( 1. - dithered, 1.0 );
}

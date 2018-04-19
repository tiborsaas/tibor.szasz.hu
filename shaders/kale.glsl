#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;

vec2 kaleido(vec2 uv)
{
	float th = atan(uv.y, uv.x);
	float r = pow(length(uv), .9);
	float f = 3.14159 / 1.5;

	th = abs(mod(th + f/4.0, f) - f/2.0) / (1.0 + r);
	//th = sin(th * 6.283 / f);

	return vec2(cos(th), sin(th)) * r * .1;
}

vec2 transform(vec2 at)
{
	vec2 v;
	float th = .02 * u_time;
	v.x = at.x * cos(th) - at.y * sin(th) - .2 * sin(th);
	v.y = at.x * sin(th) + at.y * cos(th) + .2 * cos(th);
	return v;
}

vec4 scene(vec2 at)
{
	return texture2D(u_tex0, transform(at) * 5.0);
}

void main()
{
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	uv.x = mix(-1.0, 1.0, uv.x);
	uv.y = mix(-1.0, 1.0, uv.y);
	uv.y *= u_resolution.y / u_resolution.x;
	gl_FragColor = scene(kaleido(uv));
}
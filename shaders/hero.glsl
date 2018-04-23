#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;


//-----------------------------------------------------------------------------------


// UV warping
vec2 kaleido(vec2 uv)
{
	float th = atan(uv.y, uv.x);
	float r = pow(length(uv), .9);
	float f = 3.14159 / 3.5;

	th = abs(mod(th + f/4.0, f) - f/2.0) / (1.0 + r);
	float th2 = sin(th * 6.283 / f);
    th += th2;

	return vec2(cos(th), sin(th)) * r * .1;
}

// for kaleidoscope
vec2 transform(vec2 at)
{
	vec2 v;
	float th = u_time / 100.;
	v.x = at.x * cos(th) - at.y * sin(th) - .21 * sin(th);
	v.y = at.x * sin(th) + at.y * cos(th) + .21 * cos(th);
	return v;
}

// Lens distortion around edges
vec2 lens_distortion( vec2 uv, float k, float kcube )
{
    vec2 t = uv;
    float r2 = t.x * t.x + t.y * t.y;
	float f = 0.;

    float e = k + kcube * sqrt( r2 );
    f = 1. + r2 * k * e;

    vec2 nUv = f * t;
    nUv.y = nUv.y;

    return nUv;
}


void main()
{
    /**
     * basic setup
     */
    float uvScale = 51. - 50. * smoothstep( 0., 2.5, u_time );
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	uv.x = mix(-1. * uvScale, uvScale, uv.x);
	uv.y = mix(-1. * uvScale, uvScale, uv.y);
    // Zoom out for debugging
	// uv.x = mix(-1., 1., uv.x);
	// uv.y = mix(-1., 1., uv.y);
	uv.y *= u_resolution.y / u_resolution.x;

    float distSpeed = 0.095;
    float k = 1.0 * sin( u_time * distSpeed * .9 );
    float kcube = .5 * sin( u_time * distSpeed );
    float off = .1 * sin( u_time * distSpeed * .5 );

    /**
     * kaleidoscope
     */
    // vec2 lensedUV = lens_distortion( uv, k + off, kcube );
    vec2 kaleidUV = transform(kaleido(uv)) * 4.0;
    vec4 kaleTex = texture2D(u_tex0, kaleidUV); // < update here uv

    /**
     * dithering
     */
    vec3 rgb = kaleTex.rgb;
    vec3 oldcolor = rgb + (rgb * texture2D(u_tex1, (mod(gl_FragCoord.xy, 8.0) / 8.0)).rgb);
    vec3 dithered = floor(oldcolor);
    dithered.g = .0;
    dithered.b = .261;

    /**
     * vignette fx
     */
	vec2 xy = gl_FragCoord.xy / u_resolution.xy;
	dithered *= vec3(.4, .4, .4) + 0.5*pow(100.0*xy.x*xy.y*(1.0-xy.x)*(1.0-xy.y), .4 );

    // gl_FragColor = vec4(kaleTex);
    gl_FragColor = vec4(dithered, 1.0);
}

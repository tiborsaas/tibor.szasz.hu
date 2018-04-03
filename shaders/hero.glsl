#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform sampler2D u_tex0;
uniform sampler2D u_tex1;

//-----------------------------------------------------------------------------------

#define font_size 25.
#define font_spacing .04
#define STROKEWIDTH 0.03
#define PI 3.14159265359

#define A_ vec2(0.,0.)
#define B_ vec2(1.,0.)
#define C_ vec2(2.,0.)

#define D_ vec2(0.,1.)
#define E_ vec2(1.,1.)
#define F_ vec2(2.,1.)

#define G_ vec2(0.,2.)
#define H_ vec2(1.,2.)
#define I_ vec2(2.,2.)

#define J_ vec2(0.,3.)
#define K_ vec2(1.,3.)
#define L_ vec2(2.,3.)

#define M_ vec2(0.,4.)
#define N_ vec2(1.,4.)
#define O_ vec2(2.,4.)

#define P_ vec2(0.,5.)
#define Q_ vec2(1.,5.)
#define R_ vec2(2.,5.)

#define S_ vec2(0.,6.)
#define T_ vec2(1.,6.)
#define U_ vec2(2.0,6.)

#define A(p) t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p) + t(M_,J_,p) + t(J_,L_,p)
#define B(p) t(A_,M_,p) + t(M_,O_,p) + t(O_,I_, p) + t(I_,G_,p)
#define C(p) t(I_,G_,p) + t(G_,M_,p) + t(M_,O_,p)
#define D(p) t(C_,O_,p) + t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p)
#define E(p) t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p) + t(I_,L_,p) + t(L_,J_,p)
#define F(p) t(C_,B_,p) + t(B_,N_,p) + t(G_,I_,p)
#define G(p) t(O_,M_,p) + t(M_,G_,p) + t(G_,I_,p) + t(I_,U_,p) + t(U_,S_,p)
#define H(p) t(A_,M_,p) + t(G_,I_,p) + t(I_,O_,p)
#define I(p) t(E_,E_,p) + t(H_,N_,p)
#define J(p) t(E_,E_,p) + t(H_,T_,p) + t(T_,S_,p)
#define K(p) t(A_,M_,p) + t(M_,I_,p) + t(K_,O_,p)
#define L(p) t(A_,M_,p) + t(M_,N_,p)
#define M(p) t(M_,G_,p) + t(G_,I_,p) + t(H_,N_,p) + t(I_,O_,p)
#define N(p) t(M_,G_,p) + t(G_,I_,p) + t(I_,O_,p)
#define O(p) t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p) + t(M_,G_,p)
#define P(p) t(S_,G_,p) + t(G_,I_,p) + t(I_,O_,p) + t(O_,M_, p)
#define Q(p) t(U_,I_,p) + t(I_,G_,p) + t(G_,M_,p) + t(M_,O_, p)
#define R(p) t(M_,G_,p) + t(G_,I_,p)
#define S(p) t(I_,G_,p) + t(G_,J_,p) + t(J_,L_,p) + t(L_,O_,p) + t(O_,M_,p)
#define T(p) t(B_,N_,p) + t(N_,O_,p) + t(G_,I_,p)
#define U(p) t(G_,M_,p) + t(M_,O_,p) + t(O_,I_,p)
#define V(p) t(G_,J_,p) + t(J_,N_,p) + t(N_,L_,p) + t(L_,I_,p)
#define W(p) t(G_,M_,p) + t(M_,O_,p) + t(N_,H_,p) + t(O_,I_,p)
#define X(p) t(G_,O_,p) + t(I_,M_,p)
#define Y(p) t(G_,M_,p) + t(M_,O_,p) + t(I_,U_,p) + t(U_,S_,p)
#define Z(p) t(G_,I_,p) + t(I_,M_,p) + t(M_,O_,p)
#define STOP(p) t(N_,N_,p)
#define S1(p) t(C_,A_,p) + t(A_,J_,p) + t(J_,L_,p) + t(I_,H_,p) + t(H_,E_,p) + t(E_,F_,p) + t(O_,M_,p) + t(M_,P_,p) + t(P_,R_,p)
#define S2(p) t(A_,C_,p) + t(D_,F_,p) + t(G_,H_,p) + t(H_,Q_,p) + t(Q_,P_,p) + t(J_,M_,p)
#define S3(p) t(A_,C_,p) + t(D_,F_,p) + t(F_,I_,p) + t(I_,G_,p) + t(G_,P_,p) + t(P_,R_,p) + t(L_,K_,p) + t(K_,N_,p) + t(N_,O_,p)
#define S4(p) t(A_,B_,p) + t(B_,K_,p) + t(K_,J_,p) + t(D_,G_,p) + t(M_,N_,p) + t(N_,Q_,p) + t(Q_,P_,p)
#define UL(p) t(C_,A_,p) + t(A_,D_,p) + t(D_,F_,p)
#define UM(p) t(A_,C_,p) + t(D_,F_,p)
#define UR(p) t(A_,B_,p) + t(B_,E_,p) + t(E_,D_,p)

vec2 caret_origin = vec2(3.0, .7);
vec2 caret;
float t_time = 0.; // Text drawing delay timer

//-----------------------------------------------------------------------------------
float minimum_distance(vec2 v, vec2 w, vec2 p)
{	// Return minimum distance between line segment vw and point p
  	float l2 = (v.x - w.x)*(v.x - w.x) + (v.y - w.y)*(v.y - w.y); //length_squared(v, w);  // i.e. |w-v|^2 -  avoid a sqrt
  	if (l2 == 0.0) {
		return distance(p, v);   // v == w case
	}

	// Consider the line extending the segment, parameterized as v + t (w - v).
  	// We find projection of point p onto the line.  It falls where t = [(p-v) . (w-v)] / |w-v|^2
  	float t = dot(p - v, w - v) / l2;
  	if(t < 0.0) {
		// Beyond the 'v' end of the segment
		return distance(p, v);
	} else if (t > 1.0) {
		return distance(p, w);  // Beyond the 'w' end of the segment
	}
  	vec2 projection = v + t * (w - v);  // Projection falls on the segment
	return distance(p, projection);
}

//-----------------------------------------------------------------------------------
float textColor(vec2 from, vec2 to, vec2 p)
{
	p *= font_size;
	float inkNess = 0., nearLine, corner;
	nearLine = minimum_distance(from,to,p); // basic distance from segment, thanks http://glsl.heroku.com/e#6140.0
	inkNess += smoothstep(0., 1., 1.- 14.*(nearLine - STROKEWIDTH)); // ugly still
	inkNess += smoothstep(0., 2.5, 1.- (nearLine  + 5. * STROKEWIDTH)); // glow
	return inkNess;
}

//-----------------------------------------------------------------------------------
vec2 grid(vec2 letterspace)
{
	return ( vec2( (letterspace.x / 2.) * .65 , 1.0-((letterspace.y / 2.) * .95) ));
}

float when_lt(float x, float y)
{
	return max(sign(y - x), 0.0);
}

float when_eq(float x, float y) {
    return 1.0 - abs(sign(x - y));
}

//-----------------------------------------------------------------------------------
float count = 0.0;
float t(vec2 from, vec2 to, vec2 p)
{
	count++;
    float condition = when_lt(count, t_time*15.0);

	return textColor(grid(from), grid(to), p) * condition;
}


//-----------------------------------------------------------------------------------
vec2 r(vec2 coord)
{
	vec2 pos = coord.xy/u_resolution.xy;
	pos.y -= caret.y;
	pos.x -= font_spacing*caret.x;
	return pos;
}

//-----------------------------------------------------------------------------------
void add()
{
	caret.x += 1.0;
}

//-----------------------------------------------------------------------------------
void space()
{
	caret.x += 1.5;
}

//-----------------------------------------------------------------------------------
void newline()
{
	caret.x = caret_origin.x;
	caret.y -= .18;
}

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
	float th = .009 * u_time;
	v.x = at.x * cos(th) - at.y * sin(th) - .2 * sin(th);
	v.y = at.x * sin(th) + at.y * cos(th) + .2 * cos(th);
	return v;
}

// Lens distortion around edges
vec2 lens_distortion( vec2 uv, float k, float kcube )
{
    vec2 t = uv;
    float r2 = t.x * t.x + t.y * t.y;
	float f = 0.;

    float e = ( k + kcube * sqrt( r2 ) ) * when_eq(kcube, 0.);
    f = 1. + r2 * k * e;

    vec2 nUv = f * t;
    nUv.y = nUv.y;

    return nUv;
}

float getText( vec2 coord )
{
    float tex = .0;

    t_time = u_time - 3.;
    newline();
    tex += H(r(coord)); add();
    tex += E(r(coord)); add();
    tex += L(r(coord)); add();
    tex += L(r(coord)); add();
    tex += O(r(coord)); space();
    tex += H(r(coord)); add();
    tex += U(r(coord)); add();
    tex += M(r(coord)); add();
    tex += A(r(coord)); add();
    tex += N(r(coord)); add();
    newline();
    tex += T(r(coord)); add();
    tex += I(r(coord)); add();
    tex += B(r(coord)); add();
    tex += O(r(coord)); add();
    tex += R(r(coord)); space();
    tex += H(r(coord)); add();
    tex += E(r(coord)); add();
    tex += R(r(coord)); add();
    tex += E(r(coord)); add();

    return tex;
}

void main()
{
    /**
     * basic setup
     */
    float uvScale = 51. - 50. * smoothstep( 0., 5., u_time );
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	// uv.x = mix(-1. * uvScale, uvScale, uv.x);
	// uv.y = mix(-1. * uvScale, uvScale, uv.y);
    // Zoom out for debugging
	uv.x = mix(-1., 1., uv.x);
	uv.y = mix(-1., 1., uv.y);
	uv.y *= u_resolution.y / u_resolution.x;

    float distSpeed = .095;
    float k = 1.0 * sin( u_time * distSpeed * .9 );
    float kcube = .5 * sin( u_time * distSpeed );
    float off = .1 * sin( u_time * distSpeed * .5 );

    /**
     * kaleidoscope
     */
    vec2 lensedUV = lens_distortion( uv, k + off, kcube );
    vec2 kaleidUV = transform(kaleido(uv)) * 4.0;
    // vec2 kaleidUV = transform(uv);
    // vec2 kaleidUV = transform(kaleido(uv));
    // vec2 kaleidUV = transform(kaleido(uv)) / 2.0;
    // vec2 lensedUV = lens_distortion( kaleidUV, k + off, kcube );
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
     * render text
     */
	float d = 0.;
	caret = caret_origin;

	// Build up the text
	// d = getText(gl_FragCoord.xy);

    // Vertical pixel lines
    // d = clamp(d* (.75+sin(gl_FragCoord.x*PI*.5-u_time*4.3)*.5), 0.0, 1.0);

    // dithered += vec3(d*.5, d, d*.85);

    /**
     * vignette fx
     */
	vec2 xy = gl_FragCoord.xy / u_resolution.xy;
	dithered *= vec3(.4, .4, .4) + 0.5*pow(100.0*xy.x*xy.y*(1.0-xy.x)*(1.0-xy.y), .4 );

    // gl_FragColor = vec4(kaleTex);
    gl_FragColor = vec4(dithered, 1.0);
}

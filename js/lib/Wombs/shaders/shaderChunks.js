define(function(require, exports, module) {

  require( "lib/three.min");


  var ShaderChunks = { }
 
  ShaderChunks.main = "void main() {";
  ShaderChunks.end  = "}";

  ShaderChunks.modelView = [
    "vec4 mvPosition = modelViewMatrix * vec4( pos , 1.0 );",
    "gl_Position = projectionMatrix * mvPosition;"
  ].join( "\n" );

  ShaderChunks.varyingPos = [
    "varying vec2       vUv;",
    "varying vec3       vPos;",
  ].join( "\n" );

  ShaderChunks.setVarying = [
    "vUv = uv;",    
    "vPos = position;",
  ].join( "\n" );

  ShaderChunks.polar = [

    "vec3 polar( vec3 v ){",
      "float r = length( v );",
      "float t = acos( v.z / r );",
      "float p = atan( v.y / v.x);",
      "return vec3( r , t , p );",
    "}",
        
  ].join( "\n" );


  ShaderChunks.sampleTexture = [

    'vec4 sampleTexture( sampler2D t , vec2 p ){',
      '\tvec4 tex = texture2D( t , p );',
      '\treturn tex;',
    '}'

  ].join( "\n" );

  ShaderChunks.audioUV = [

    "vec2 audioUV( sampler2D t , vec2 uv ){",
      "float x = length( texture2D( t , vec2( uv.x , 0.0 ) ) );",
      "float y = length( texture2D( t , vec2( uv.x , 0.0 ) ) );",
      "return  vec2( x , y );",
    "}",


  ].join( "\n" );

  ShaderChunks.absUV = [

    "vec2 absUV( vec2 pos ){",
      "return abs( pos - .5 ) * 2.0;",
    "}"

  ].join( "\n" );

  ShaderChunks.absNPos = [

    "vec2 absNPos( vec3 pos ){",
      "vec3 nPos = normalize( pos );",
      "return abs( nPos );",
    "}"

  ].join( "\n" ),

  ShaderChunks.sampleAudio_diamond = [

    "vec4 sampleAudio_diamond( sample2D t , vec2 UV ){",
      "vec2 cUV = UV - 0.5;",
      "float abs = abs( cUV.x )  + abs( cUV.y );",
      "return texture2D( t , ( abs , 0.0 ) );",
    "}"
    
  ].join( "\n" ),

  ShaderChunks.audioUV = [

    "vec2 audioUV( sampler2D t , vec2 uv ){",
      "float x = length( texture2D( t , vec2( uv.x , 0.0 ) ) );",
      "float y = length( texture2D( t , vec2( uv.y , 0.0 ) ) );",
      "return  vec2( x , y );",
    "}",


  ].join( "\n" ),

  ShaderChunks.audioPosition = [ 

    'vec3 audioPosition( sampler2D t , vec3 p ){',
      '\tvec3 nPos = normalize( p );',
      '\tvec3 coord = ( nPos + 1.0 ) * 0.5;',
      '\tnPos.x = texture2D( t , vec2( coord.x , 0.0 ) ).a;',
      '\tnPos.y = texture2D( t , vec2( coord.y , 0.0 ) ).a;',
      '\tnPos.z = texture2D( t , vec2( coord.z , 0.0 ) ).a;',
      '\treturn nPos;',
    '}'

  ].join( "\n" ),

  ShaderChunks.absAudioPosition = [ 

    'vec3 absAudioPosition( sampler2D t , vec3 p ){',
      '\tvec3 nPos = normalize( p );',
      '\tnPos.x = length( texture2D( t , vec2( abs(nPos.x) , 0.0 ) ) );',
      '\tnPos.y = length( texture2D( t , vec2( abs(nPos.y) , 0.0 ) ) );',
      '\tnPos.z = length( texture2D( t , vec2( abs(nPos.z) , 0.0 ) ) );',
      '\treturn nPos;',
    '}'

  ].join( "\n" ),

  ShaderChunks.audioColor =  [ 

    'vec3 audioColor( sampler2D audio , float sample , vec3 color ){',
      'float a = texture2D( audio , vec2( sample , 0.0 ) ).a;',
      'vec3 c = color * a;',
      'return c;',  
    '}'

  ].join( "\n" ),
  
  ShaderChunks.createAudioColorShader = function( sample ){

    var array = [
      "uniform sampler2D  texture;",
      "uniform vec3 color;",
      "varying vec2 vUv;",
      ShaderChunks.audioColor,
      "void main( void ) {",
        "float s = " + sample + ";",

        "vec3 c = audioColor( texture , s , color );",
        "gl_FragColor = vec4( c , 1.0 );",

      "}"
    ].join( "\n" );

    return array;


  }


  ShaderChunks.createKali = function(precision){

    var shader = [

      "vec3 kali( vec3 v , vec3 s ){",
        "float m = 0.0;",
        "for( int i = 0; i < " + precision + "; i ++){",
          "v.x = abs(v.x);",
          "v.y = abs(v.y);", 
          "v.z = abs(v.z);",
          "m = v.x * v.x + v.y * v.y + v.z * v.z;",
          "v.x = v.x / m + s.x;",
          "v.y = v.y / m + s.y;",
          "v.z = v.z / m + s.z;",
        "}",
        "return v;",
      "}",
    
    ].join("\n");

    return shader;
  
  }


 


  ShaderChunks.createPhysicsTextureLoop = function(){

    var string = [
      "for (float y=0.0;y< textureWidth; y++) {",
        "for (float x=0.0;x< textureWidth; x++) {",
          "if ( x == gl_FragCoord.x && y == gl_FragCoord.y ) continue;",
            
          "vec3 pPos = texture2D( texturePosition,",
              "vec2(x/resolution.x, y/resolution.y) ).xyz;",

          "vec3 pVel = texture2D( textureVelocity,",
            "vec2(x/resolution.x, y/resolution.y) ).xyz;",

          "float pMass = texture2D( textureVelocity,",
            "vec2(x/resolution.x, y/resolution.y) ).w;"
    ];

    // Passing in all arguments
    for( var i = 0; i < arguments.length; i++ ){
      string.push( arguments[i]);
    }

    string.push( "}" );
    string.push( "}" );
    
    return string.join("\n")

  };

  ShaderChunks.physicsUniforms = [

    "uniform vec2 resolution;",
    "uniform float time;",

    "uniform sampler2D textureVelocity;",
    "uniform sampler2D texturePosition;"


  ].join("\n");
  
  ShaderChunks.physicsUniforms_OG = [
    
    "uniform sampler2D textureVelocity_OG;",
    "uniform sampler2D texturePosition_OG;"
  
  ].join("\n");



  ShaderChunks.physicsUniforms_bounds = [

    "uniform float upperBounds;",
    "uniform float lowerBounds;", 

  ].join("\n");


  ShaderChunks.assignUV = [

    "vec2 uv = gl_FragCoord.xy / resolution.xy;",

  ].join("\n");


  ShaderChunks.PI   = ["const float PI = 3.141592653589793;" ].join("\n");
  ShaderChunks.PI_2 = ["const float PI_2 = 3.141592653589793 * 2.0;" ].join("\n");


  ShaderChunks.rand2D = [
    "float rand(vec2 co){",
      "return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
    "}",
  ].join("\n");

  ShaderChunks.noise3D = [
      'vec3 mod289(vec3 x) {',
          '\treturn x - floor(x * (1.0 / 289.0)) * 289.0;',
      '}',
      '',
      'vec4 mod289(vec4 x) {',
          '\treturn x - floor(x * (1.0 / 289.0)) * 289.0;',
      '}',
      '',
      'vec4 permute(vec4 x) {',
          '\treturn mod289(((x*34.0)+1.0)*x);',
      '}',
      '',
      'vec4 taylorInvSqrt(vec4 r)',
      '{',
          '\treturn 1.79284291400159 - 0.85373472095314 * r;',
      '}',
      '',
      'float snoise(vec3 v)',
      '{',
          '\tconst vec2  C = vec2(1.0/6.0, 1.0/3.0);',
          '\tconst vec4  D = vec4(0.0, 0.5, 1.0, 2.0);',
          '',
          '\tvec3 i = floor(v + dot(v, C.yyy));',
          '\tvec3 x0 = v - i + dot(i, C.xxx);',
          '',
          '\tvec3 g = step(x0.yzx, x0.xyz);',
          '\tvec3 l = 1.0 - g;',
          '\tvec3 i1 = min( g.xyz, l.zxy );',
          '\tvec3 i2 = max( g.xyz, l.zxy );',
          '',
          '\tvec3 x1 = x0 - i1 + C.xxx;',
          '\tvec3 x2 = x0 - i2 + C.yyy;',
          '\tvec3 x3 = x0 - D.yyy;',
          '',
          '\ti = mod289(i);', 
          '\tvec4 p = permute( permute( permute( i.z + vec4(0.0, i1.z, i2.z, 1.0 )) + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));',
          '',
          '\tfloat n_ = 0.142857142857;',
          '\tvec3  ns = n_ * D.wyz - D.xzx;',
          '',
          '\tvec4 j = p - 49.0 * floor(p * ns.z * ns.z);',
          '',
          '\tvec4 x_ = floor(j * ns.z);',
          '\tvec4 y_ = floor(j - 7.0 * x_ );',
          '',
          '\tvec4 x = x_ *ns.x + ns.yyyy;',
          '\tvec4 y = y_ *ns.x + ns.yyyy;',
          '\tvec4 h = 1.0 - abs(x) - abs(y);',
          '',
          '\tvec4 b0 = vec4( x.xy, y.xy );',
          '\tvec4 b1 = vec4( x.zw, y.zw );',
          '',
          '\tvec4 s0 = floor(b0)*2.0 + 1.0;',
          '\tvec4 s1 = floor(b1)*2.0 + 1.0;',
          '\tvec4 sh = -step(h, vec4(0.0));',
          '',
          '\tvec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;',
          '\tvec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;',
          '',
          '\tvec3 p0 = vec3(a0.xy,h.x);',
          '\tvec3 p1 = vec3(a0.zw,h.y);',
          '\tvec3 p2 = vec3(a1.xy,h.z);',
          '\tvec3 p3 = vec3(a1.zw,h.w);',
          '',
          '\tvec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));',
          '\tp0 *= norm.x;',
          '\tp1 *= norm.y;',
          '\tp2 *= norm.z;',
          '\tp3 *= norm.w;',
          '',
          '\tvec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);',
          '\tm = m * m;',
          '\treturn 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));',
      '}'
  ].join("\n");


  ShaderChunks.noise4D = [
      'vec4 mod289(vec4 x) {',
      '\treturn x - floor(x * (1.0 / 289.0)) * 289.0; }',
      '',
      'float mod289(float x) {',
          '\treturn x - floor(x * (1.0 / 289.0)) * 289.0; }',
      '',
      'vec4 permute(vec4 x) {',
          '\treturn mod289(((x*34.0)+1.0)*x);',
      '}',
      '',
      'float permute(float x) {',
          '\treturn mod289(((x*34.0)+1.0)*x);',
      '}',
      '',
      'vec4 taylorInvSqrt(vec4 r) {',
          '\treturn 1.79284291400159 - 0.85373472095314 * r;',
      '}',
      '',
      'float taylorInvSqrt(float r) {',
          '\treturn 1.79284291400159 - 0.85373472095314 * r;',
      '}',
      '',
      'vec4 grad4(float j, vec4 ip) {',
          '\tconst vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);',
          '\tvec4 p,s;',
          '',
          '\tp.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;',
          '\tp.w = 1.5 - dot(abs(p.xyz), ones.xyz);',
          '\ts = vec4(lessThan(p, vec4(0.0)));',
          '\tp.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;',
          '',
          '\treturn p;',
      '}',
      '',
      '#define F4 0.309016994374947451',
      '',
      'float snoise(vec4 v) {',
          '\tconst vec4  C = vec4( 0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);',
          '',
          '\tvec4 i  = floor(v + dot(v, vec4(F4)) );',
          '\t\tvec4 x0 = v -   i + dot(i, C.xxxx);',
          '',
          '\tvec4 i0;',
          '\tvec3 isX = step( x0.yzw, x0.xxx );',
          '\tvec3 isYZ = step( x0.zww, x0.yyz );',
          '',
          '\ti0.x = isX.x + isX.y + isX.z;',
          '\ti0.yzw = 1.0 - isX;',
          '\ti0.y += isYZ.x + isYZ.y;',
          '\ti0.zw += 1.0 - isYZ.xy;',
          '\ti0.z += isYZ.z;',
          '\ti0.w += 1.0 - isYZ.z;',
          '',
          '\tvec4 i3 = clamp( i0, 0.0, 1.0 );',
          '\tvec4 i2 = clamp( i0-1.0, 0.0, 1.0 );',
          '\tvec4 i1 = clamp( i0-2.0, 0.0, 1.0 );',
          '',
          '\tvec4 x1 = x0 - i1 + C.xxxx;',
          '\tvec4 x2 = x0 - i2 + C.yyyy;',
          '\tvec4 x3 = x0 - i3 + C.zzzz;',
          '\tvec4 x4 = x0 + C.wwww;',
          '',
          '\ti = mod289(i);',
          '\tfloat j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);',
          '\tvec4 j1 = permute( permute( permute( permute (i.w + vec4(i1.w, i2.w, i3.w, 1.0 )) + i.z + vec4(i1.z, i2.z, i3.z, 1.0 )) + i.y + vec4(i1.y, i2.y, i3.y, 1.0 )) + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));',
          '',
          '\tvec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0);',
          '',
          '\tvec4 p0 = grad4(j0,   ip);',
          '\tvec4 p1 = grad4(j1.x, ip);',
          '\tvec4 p2 = grad4(j1.y, ip);',
          '\tvec4 p3 = grad4(j1.z, ip);',
          '\tvec4 p4 = grad4(j1.w, ip);',
          '',
          '\tvec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));',
          '\tp0 *= norm.x;',
          '\tp1 *= norm.y;',
          '\tp2 *= norm.z;',
          '\tp3 *= norm.w;',
          '\tp4 *= taylorInvSqrt(dot(p4,p4));',
          '',
          '\tvec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);',
          '\tvec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);',
          '\tm0 = m0 * m0;',
          '\tm1 = m1 * m1;',
          '\treturn 49.0 * (dot(m0*m0, vec3(dot(p0, x0), dot(p1, x1), dot(p2, x2))) + dot(m1*m1, vec2(dot(p3, x3), dot(p4, x4))));',
      '}'
  ].join('\n'),

  ShaderChunks.bindUsingVelocity = [
    "vec3 bindUsingVelocity( vec2 bounds , vec3 position , vec3 velocity ){",
      "if( position.x + velocity.x * 5.0 < bounds.x ) velocity.x = -velocity.x;",
      "if( position.x + velocity.x * 5.0 > bounds.y ) velocity.x = -velocity.x;",

      "if( position.y + velocity.y * 5.0 < bounds.x ) velocity.y = -velocity.y;",
      "if( position.y + velocity.y * 5.0 > bounds.y ) velocity.y = -velocity.y;",

      "if( position.z + velocity.z * 5.0 < bounds.x ) velocity.z = -velocity.z;",
      "if( position.z + velocity.z * 5.0 > bounds.y ) velocity.z = -velocity.z;",

      "return velocity;",
    "}"
  ].join('\n'),


  ShaderChunks.noise3D_3 = [

    ShaderChunks.noise3D, 

    "vec3 snoise_3( vec3 x ){",

      "float s  = snoise(vec3( x ));",
      "float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));",
      "float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));",
      "vec3 c = vec3( s , s1 , s2 );",
      "return c;",

    "}"


  ].join("\n");



  ShaderChunks.curlNoise = [

      ShaderChunks.noise3D_3,
      
      "vec3 curlNoise( vec3 p ){",
        "const float e = 1e-1;",
        "vec3 dx = vec3( e   , 0.0 , 0.0 );",
	    "vec3 dy = vec3( 0.0 , e   , 0.0 );",
	    "vec3 dz = vec3( 0.0 , 0.0 , e   );",

        "vec3 p_x0 = snoise_3( p - dx );",
	    "vec3 p_x1 = snoise_3( p + dx );",
	    "vec3 p_y0 = snoise_3( p - dy );",
	    "vec3 p_y1 = snoise_3( p + dy );",
	    "vec3 p_z0 = snoise_3( p - dz );",
	    "vec3 p_z1 = snoise_3( p + dz );",
    
        "float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;",
	    "float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;",
	    "float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;",

        "const float divisor = 1.0 / ( 2.0 * e );",
        "return normalize( vec3( x , y , z ) * divisor );",
      "}"

  ].join("\n");


  module.exports = ShaderChunks;

})

define(function(require, exports, module) {

  require( "lib/three.min");


  var ShaderChunks = {
 
    main  : "void main() {",
    end   : "}",

    modelView : [
      "vec4 mvPosition = modelViewMatrix * vec4( pos , 1.0 );",
      "gl_Position = projectionMatrix * mvPosition;"
    ].join( "\n" ),

    varyingPos : [
      "varying vec2       vUv;",
      "varying vec3       vPos;",
    ].join( "\n" ),

    setVarying : [
      "vUv = uv;",    
      "vPos = position;",
    ].join( "\n" ),

    polar : [

      "vec3 polar( vec3 v ){",
        "float r = length( v );",
        "float t = acos( v.z / r );",
        "float p = atan( v.y / v.x);",
        "return vec3( r , t , p );",
      "}",
        
    ].join( "\n" ),


    sampleTexture : [

      'vec4 sampleTexture( sampler2D t , vec2 p ){',
        '\tvec4 tex = texture2D( t , p );',
        '\treturn tex;',
      '}'

    ].join( "\n" ),

    audioUV: [

      "vec2 audioUV( sampler2D t , vec2 uv ){",
        "float x = length( texture2D( t , vec2( uv.x , 0.0 ) ) );",
        "float y = length( texture2D( t , vec2( uv.x , 0.0 ) ) );",
        "return  vec2( x , y );",
      "}",


    ].join( "\n" ),

    absUV: [

      "vec2 absUV( vec2 pos ){",
        "return abs( pos - .5 ) * 2.0;",
      "}"

    ].join( "\n" ),

    absNPos: [

      "vec2 absNPos( vec3 pos ){",
        "vec3 nPos = normalize( pos );",
        "return abs( nPos );",
      "}"

    ].join( "\n" ),

    sampleAudio_diamond: [

      "vec4 sampleAudio_diamond( sample2D t , vec2 UV ){",
        "vec2 cUV = UV - 0.5;",
        "float abs = abs( cUV.x )  + abs( cUV.y );",
        "return texture2D( t , ( abs , 0.0 ) );",
      "}"
      
    ].join( "\n" ),

    audioUV: [

      "vec2 audioUV( sampler2D t , vec2 uv ){",
        "float x = length( texture2D( t , vec2( uv.x , 0.0 ) ) );",
        "float y = length( texture2D( t , vec2( uv.y , 0.0 ) ) );",
        "return  vec2( x , y );",
      "}",


    ].join( "\n" ),

    audioPosition:[ 

      'vec3 audioPosition( sampler2D t , vec3 p ){',
        '\tvec3 nPos = normalize( p );',
        '\tvec3 coord = ( nPos + 1.0 ) * 0.5;',
        '\tnPos.x = texture2D( t , vec2( coord.x , 0.0 ) ).a;',
        '\tnPos.y = texture2D( t , vec2( coord.y , 0.0 ) ).a;',
        '\tnPos.z = texture2D( t , vec2( coord.z , 0.0 ) ).a;',
        '\treturn nPos;',
      '}'

    ].join( "\n" ),

    absAudioPosition:[ 

      'vec3 absAudioPosition( sampler2D t , vec3 p ){',
        '\tvec3 nPos = normalize( p );',
        '\tnPos.x = length( texture2D( t , vec2( abs(nPos.x) , 0.0 ) ) );',
        '\tnPos.y = length( texture2D( t , vec2( abs(nPos.y) , 0.0 ) ) );',
        '\tnPos.z = length( texture2D( t , vec2( abs(nPos.z) , 0.0 ) ) );',
        '\treturn nPos;',
      '}'

    ].join( "\n" ),


    kali_30: [
       // v : vertex
       // s : seed
       // p : precesion
      "vec3 kali( vec3 v , vec3 s ){",
        "float m = 0.0;",
        "for( int i = 0; i < 30 ; i ++){",
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
    ].join("\n"),

    kali_10: [
       // v : vertex
       // s : seed
       // p : precesion
      "vec3 kali( vec3 v , vec3 s ){",
        "float m = 0.0;",
        "for( int i = 0; i < 10 ; i ++){",
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
    ].join("\n"),




    noise3D: [
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
    ].join('\n'),


    bindPosition:[
      "vec3 bound( vec2 bounds , vec3 position , vec3 velocity ){",
        "if( position.x + velocity.x * 5.0 < bounds[0] ) vector.x = -vector.x;",
        "if( position.x + velocity.x * 5.0 > bounds[1] ) vector.x = -vector.x;",

        "if( position.y + velocity.y * 5.0 < bounds[0] ) vector.y = -vector.y;",
        "if( position.y + velocity.y * 5.0 > bounds[1] ) vector.y = -vector.y;",

        "if( position.z + velocity.z * 5.0 < bounds[0] ) vector.z = -vector.z;",
        "if( position.z + velocity.z * 5.0 > bounds[1] ) vector.z = -vector.z;",

        "return vector;",
      "}"
    ].join('\n'),


   
   

  }



  module.exports = ShaderChunks;

})

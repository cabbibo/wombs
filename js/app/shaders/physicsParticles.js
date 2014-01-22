define(function(require, exports, module) {

  var SC = require("app/shaders/shaderChunks");


  var physicsParticles = {

    basic:{ 

     uniforms:  THREE.UniformsUtils.merge( [

      { "lookup": { type: "t", value: null } },
      THREE.UniformsLib[ "particle" ],
      THREE.UniformsLib[ "shadowmap" ],
      { "moocolor": { type: "vec3", value: new THREE.Color( 0xffffff ) } },
    
      ] ),
    
    
      vertexShader: [

        "uniform sampler2D lookup;",

        "uniform float size;",
        "uniform float scale;",
        "varying float mass;",

        THREE.ShaderChunk[ "color_pars_vertex" ],
        THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

        "void main() {",

          THREE.ShaderChunk[ "color_vertex" ],


          "vec2 lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
          "vec3 pos = texture2D( lookup, lookupuv ).rgb;",
          "mass = texture2D( lookup, lookupuv ).w;",

          // position
          "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
            "gl_PointSize = size * ( scale / length( mvPosition.xyz ) ) * mass;",
          "#else",
            "gl_PointSize = size * mass;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk[ "worldpos_vertex" ],
          THREE.ShaderChunk[ "shadowmap_vertex" ],

        "}"

      ].join("\n"),

      fragmentShader: [

        "uniform vec3 psColor;",
        "uniform vec3 color;",
        "uniform float opacity;",

        "varying float mass;",
        "varying vec3 vColor;",
        "uniform sampler2D map;",
        THREE.ShaderChunk[ "fog_pars_fragment" ],
        THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

        "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          "gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );",
          "if ( gl_FragColor.a < .01) discard;",
          "gl_FragColor.r *= mass;",
        
          THREE.ShaderChunk[ "shadowmap_fragment" ],
          THREE.ShaderChunk[ "fog_fragment" ],

        "}"

      ].join("\n")

    },

     basic1:{ 

     uniforms:  THREE.UniformsUtils.merge( [

      { "lookup": { type: "t", value: null } },
      { "lookupVel": { type: "t", value: null } },
      THREE.UniformsLib[ "particle" ],
      THREE.UniformsLib[ "shadowmap" ],
      { "moocolor": { type: "vec3", value: new THREE.Color( 0xffffff ) } },
    
      ] ),
    
    
      vertexShader: [

        "uniform sampler2D lookup;",
        "uniform sampler2D lookupVel;",

        "uniform float size;",
        "uniform float scale;",
        "varying float mass;",
        "varying vec3  vPos;",
        "varying vec3  vVel;",

        THREE.ShaderChunk[ "color_pars_vertex" ],
  
        "void main() {",

          THREE.ShaderChunk[ "color_vertex" ],

        

          "vec2 lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
          "vec3 pos = texture2D( lookup, lookupuv ).rgb;",
          "vec3 vel = texture2D( lookupVel, lookupuv ).rgb;",

          "mass = texture2D( lookup, lookupuv ).w;",
          "vPos = pos;",
          "vVel = vel;",

          // position
          "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
            "gl_PointSize = size * ( scale / length( mvPosition.xyz ) ) * mass;",
          "#else",
            "gl_PointSize = size * mass;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk[ "worldpos_vertex" ],

        "}"

      ].join("\n"),

      fragmentShader: [

        "uniform vec3 psColor;",
        "uniform vec3 color;",
        "uniform float opacity;",

        "varying float mass;",
        "varying vec3 vColor;",
        "uniform sampler2D map;",
        "varying vec3 vPos;",
        "varying vec3 vVel;",

        SC.noise3D_3,
        THREE.ShaderChunk[ "fog_pars_fragment" ],

        "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          "gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );",
          "if ( gl_FragColor.a < .01) discard;",

          'gl_FragColor = vec4( gl_FragColor.xyz * normalize( vVel ), gl_FragColor.w );',
          //"vec3 c = snoise_3( vPos * .001 );",
          //"c = ( c * gl_FragColor.xyz ) * .5 + gl_FragColor.xyz * .5 ; ",
          //"gl_FragColor = vec4( c , 1.0 );",
        
          THREE.ShaderChunk[ "fog_fragment" ],

        "}"

      ].join("\n"),

    },
    basicAudio:{ 

     uniforms:  THREE.UniformsUtils.merge( [

      { "lookup": { type: "t", value: null } },
      THREE.UniformsLib[ "particle" ],
      THREE.UniformsLib[ "shadowmap" ],
      { "moocolor": { type: "vec3", value: new THREE.Color( 0xffffff ) } },
      { "audioTexture" : { type: "t", value: null } },
    
    ] ),
    
    
      vertexShader: [

        "uniform sampler2D lookup;",

        "uniform float size;",
        "uniform float scale;",
        "varying float mass;",
        "varying vec3  vPos;",
        "varying vec2 lookupuv;",

        "uniform sampler2D  audioTexture;",

        THREE.ShaderChunk[ "color_pars_vertex" ],
  
        "void main() {",

          THREE.ShaderChunk[ "color_vertex" ],

          
          "lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
          "vec3 pos = texture2D( lookup, lookupuv ).rgb;",
          "mass = texture2D( lookup, lookupuv ).w;",
          "vPos = pos;",

          // position
          "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
            "gl_PointSize = size * ( scale / length( mvPosition.xyz ) ) * mass;",
          "#else",
            "gl_PointSize = size * texture2D( audioTexture , vec2( lookupuv.x , 0.0 ) ).a;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk[ "worldpos_vertex" ],

        "}"

      ].join("\n"),

      fragmentShader: [

        "uniform vec3 psColor;",
        "uniform vec3 color;",
        "uniform float opacity;",

        "varying float mass;",
        "varying vec3 vColor;",
        "uniform sampler2D map;",
        "varying vec3 vPos;",

        "varying vec2 lookupuv;",

        "uniform sampler2D  audioTexture;",

        SC.noise3D_3,
        THREE.ShaderChunk[ "fog_pars_fragment" ],

        "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          "gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );",
          "if ( gl_FragColor.a < .01) discard;",

          "gl_FragColor.x *= lookupuv.x;",
          "gl_FragColor.y *= lookupuv.y;",

          //"gl_FragColor *= texture2D( audioTexture , vec2( ( lookupuv.x )/2.0 , 0.0 ) );",


          //"vec3 c = snoise_3( vPos * .001 );",
          //"c = ( c * gl_FragColor.xyz ) * .5 + gl_FragColor.xyz * .5 ; ",
          //"gl_FragColor = vec4( c , 1.0 );",
        
          THREE.ShaderChunk[ "fog_fragment" ],

        "}"

      ].join("\n")


    },


    basicPicture:{ 

     uniforms:  THREE.UniformsUtils.merge( [

      { "lookup": { type: "t", value: null } },
      THREE.UniformsLib[ "particle" ],
      THREE.UniformsLib[ "shadowmap" ],
      { "moocolor": { type: "vec3", value: new THREE.Color( 0xffffff ) } },
    
      ] ),
    
    
      vertexShader: [

        "uniform sampler2D lookup;",

        "uniform float size;",
        "uniform float scale;",
        "varying float mass;",
        "varying vec3 vPos;",

        THREE.ShaderChunk[ "color_pars_vertex" ],
        THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

        "void main() {",

          THREE.ShaderChunk[ "color_vertex" ],


          //"vPos = position;"
          "vec2 lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
          //"vPos = lookupuv;",
          "vec3 pos = texture2D( lookup, lookupuv ).rgb;",
          "vPos = pos;",
          "mass = texture2D( lookup, lookupuv ).w;",

          // position
          "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
            "gl_PointSize = size * ( scale / length( mvPosition.xyz ) ) * mass;",
          "#else",
            "gl_PointSize = size * mass;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk[ "worldpos_vertex" ],
          THREE.ShaderChunk[ "shadowmap_vertex" ],

        "}"

      ].join("\n"),

      fragmentShader: [

        "uniform vec3 psColor;",
        "uniform vec3 color;",
        "uniform float opacity;",

        "varying vec3 vPos;",

        "varying float mass;",
        "varying vec3 vColor;",
        "uniform sampler2D map;",

        THREE.ShaderChunk[ "fog_pars_fragment" ],
        THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

        "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          "gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );",
          "if ( gl_FragColor.a < .01) discard;",
          "gl_FragColor.r *= mass;",

          "gl_FragColor = vec4( vPos , 1.0 );",        
          THREE.ShaderChunk[ "shadowmap_fragment" ],
          THREE.ShaderChunk[ "fog_fragment" ],

        "}"

      ].join("\n")

    },

    basicData:{ 

     uniforms:  THREE.UniformsUtils.merge( [

      { "lookup": { type: "t", value: null } },
      THREE.UniformsLib[ "particle" ],
      THREE.UniformsLib[ "shadowmap" ],
      { "moocolor": { type: "vec3", value: new THREE.Color( 0xffffff ) } },
    
      ] ),
    
    
      vertexShader: [

        "uniform sampler2D lookup;",

        "uniform float size;",
        "uniform float scale;",
        "varying float mass;",
        "varying vec3 vPos;",

        THREE.ShaderChunk[ "color_pars_vertex" ],
        THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

        "void main() {",

          THREE.ShaderChunk[ "color_vertex" ],


          //"vPos = position;"
          "vec2 lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
          //"vPos = lookupuv;",
          "vec3 pos = texture2D( lookup, lookupuv ).rgb;",
          "vPos = pos;",
          "mass = texture2D( lookup, lookupuv ).w;",

          // position
          "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
            "gl_PointSize = size * ( scale / length( mvPosition.xyz ) ) * mass;",
          "#else",
            "gl_PointSize = size * mass;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk[ "worldpos_vertex" ],
          THREE.ShaderChunk[ "shadowmap_vertex" ],

        "}"

      ].join("\n"),

      fragmentShader: [

        "uniform vec3 psColor;",
        "uniform vec3 color;",
        "uniform float opacity;",

        "varying vec3 vPos;",

        "varying float mass;",
        "varying vec3 vColor;",
        "uniform sampler2D map;",

        THREE.ShaderChunk[ "fog_pars_fragment" ],
        THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

        "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          "gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );",
          "if ( gl_FragColor.a < .01) discard;",
          "gl_FragColor.r *= mass;",

          "gl_FragColor = vec4( vPos , 1.0 );",        
          THREE.ShaderChunk[ "shadowmap_fragment" ],
          THREE.ShaderChunk[ "fog_fragment" ],

        "}"

      ].join("\n")

    },




  };


  module.exports = physicsParticles;

});

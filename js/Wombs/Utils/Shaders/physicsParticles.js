define(function(require, exports, module) {

  var SC = require("Shaders/shaderChunks");


  
  var physicsParticles = {

    uniforms: {

      basic:THREE.UniformsUtils.merge( [

        { "lookup": { type: "t", value: null } },
        THREE.UniformsLib[ "particle" ],
        THREE.UniformsLib[ "shadowmap" ],
        { "moocolor": { type: "vec3", value: new THREE.Color( 0xffffff ) } },
    
      ] ),

      velocity:THREE.UniformsUtils.merge( [

        { "lookup": { type: "t", value: null } },
        { "lookupVel": { type: "t", value: null } },
        THREE.UniformsLib[ "particle" ],
        THREE.UniformsLib[ "shadowmap" ],
        { "moocolor": { type: "vec3", value: new THREE.Color( 0xffffff ) } },
    
      ] ),


      audio:  THREE.UniformsUtils.merge( [

        { "lookup": { type: "t", value: null } },
        THREE.UniformsLib[ "particle" ],
        THREE.UniformsLib[ "shadowmap" ],
        { "moocolor": { type: "vec3", value: new THREE.Color( 0xffffff ) } },
        { "audioTexture" : { type: "t", value: null } },
      
      ] ),

    },

    vertex:{

      lookup: [

        "uniform sampler2D lookup;",

        "uniform float size;",
        "uniform float scale;",

        "varying vec2 lookupuv;",

        "varying vec4  pos;",

        THREE.ShaderChunk[ "color_pars_vertex" ],
        THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

        "void main() {",

          THREE.ShaderChunk[ "color_vertex" ],


          "lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
          "pos = texture2D( lookup, lookupuv );",

          // position
          "vec4 mvPosition = modelViewMatrix * vec4( pos.xyz , 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
            "gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
          "#else",
            "gl_PointSize = size ;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk[ "worldpos_vertex" ],
          THREE.ShaderChunk[ "shadowmap_vertex" ],

        "}"

      ].join("\n"),

      lookupPrecision: [

        "uniform sampler2D lookup;",
        "uniform sampler2D lookupP;",

        "uniform float size;",
        "uniform float scale;",

        "varying vec2 lookupuv;",

        "varying vec4  pos;",

        THREE.ShaderChunk[ "color_pars_vertex" ],
        THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

        "void main() {",

          THREE.ShaderChunk[ "color_vertex" ],


          "lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
         // "lookupuv = uv;",

          //"pos  = texture2D( lookup, lookupuv );",
          "pos   = texture2D( lookup, lookupuv );",
          "pos  += texture2D( lookupP , lookupuv )/64.0;",

          // position
          "vec4 mvPosition = modelViewMatrix * vec4( pos.xyz , 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
            "gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
          "#else",
            "gl_PointSize = size ;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk[ "worldpos_vertex" ],
          THREE.ShaderChunk[ "shadowmap_vertex" ],

        "}"

      ].join("\n"),


      velocityLookup: [

        "uniform sampler2D lookup;",
        "uniform sampler2D lookupVel;",

        "uniform float size;",
        "uniform float scale;",

        "varying vec2 lookupuv;",

        "varying vec4  pos;",
        "varying vec4  vel;",

        THREE.ShaderChunk[ "color_pars_vertex" ],
  
        "void main() {",

          THREE.ShaderChunk[ "color_vertex" ],

          "lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
          "pos = texture2D( lookup, lookupuv );",
          "vel = texture2D( lookupVel, lookupuv );",

                    // position
          "vec4 mvPosition = modelViewMatrix * vec4( pos.xyz , 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
            "gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
          "#else",
            "gl_PointSize = size * mass;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk[ "worldpos_vertex" ],

        "}"

      ].join("\n"),


      audio:  [

        "uniform sampler2D lookup;",

        "uniform float size;",
        "uniform float scale;",
        "varying vec4  pos;",
        "varying vec2 lookupuv;",

        "uniform sampler2D  audioTexture;",

        THREE.ShaderChunk[ "color_pars_vertex" ],
  
        "void main() {",

          THREE.ShaderChunk[ "color_vertex" ],

          
          "lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
          
          
          "pos = texture2D( lookup, lookupuv );",

          // position
          "vec4 mvPosition = modelViewMatrix * vec4( pos.xyz , 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
            "gl_PointSize = size * ( scale / length( mvPosition.xyz ) ); ",
          "#else",
            "float aS = texture2D( audioTexture , vec2( lookupuv.x , 0.0 ) ).a;",
            "gl_PointSize = 3.0 * size * aS*aS*aS;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk[ "worldpos_vertex" ],

        "}"

      ].join("\n"),




    },

    fragment: {


      basic: [

        "uniform vec3 psColor;",
        "uniform vec3 color;",
        "uniform float opacity;",

        "varying vec3 vColor;",

        "varying vec2 lookupuv;",

        "uniform sampler2D map;",
        THREE.ShaderChunk[ "fog_pars_fragment" ],
        THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

        "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          //"gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );",
          //"if ( gl_FragColor.a < .01) discard;",
        
          THREE.ShaderChunk[ "shadowmap_fragment" ],
          //THREE.ShaderChunk[ "fog_fragment" ],

        "}"

      ].join("\n"),


      velocity: [

        "uniform vec3 psColor;",
        "uniform vec3 color;",
        "uniform float opacity;",

        "varying vec3 vColor;",
        "uniform sampler2D map;",
        "varying vec4 pos;",
        "varying vec4 vel;",

        "varying vec2 lookupuv;",

        THREE.ShaderChunk[ "fog_pars_fragment" ],

        "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          "gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );",
          "if ( gl_FragColor.a < .01) discard;",

          "gl_FragColor = gl_FragColor * vel;",
          THREE.ShaderChunk[ "fog_fragment" ],

        "}"

      ].join("\n"),

      position: [

        "uniform vec3 psColor;",
        "uniform vec3 color;",
        "uniform float opacity;",

        "varying vec3 vColor;",
        "uniform sampler2D map;",
        "varying vec4 pos;",

        "varying vec2 lookupuv;",

        THREE.ShaderChunk[ "fog_pars_fragment" ],

        "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          "gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );",
          "if ( gl_FragColor.a < .01) discard;",

          "gl_FragColor = gl_FragColor * pos;",

          THREE.ShaderChunk[ "fog_fragment" ],

        "}"

      ].join("\n"),
     


      audio: [

        "uniform vec3 psColor;",
        "uniform vec3 color;",
        "uniform float opacity;",

        "varying vec3 vColor;",
        "uniform sampler2D map;",
        "varying vec4 pos;",

        "varying vec2 lookupuv;",

        "uniform sampler2D  audioTexture;",

        THREE.ShaderChunk[ "fog_pars_fragment" ],

        "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          "gl_FragColor = gl_FragColor * texture2D( map, vec2( gl_PointCoord.x, 1.0 - gl_PointCoord.y ) );",
          "if ( gl_FragColor.a < .01) discard;",

          "gl_FragColor.x *= lookupuv.x;",
          "gl_FragColor.y *= lookupuv.y;",
        
          THREE.ShaderChunk[ "fog_fragment" ],

        "}"

      ].join("\n"),


    }


  };


  module.exports = physicsParticles;

});

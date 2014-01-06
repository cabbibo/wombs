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
            "gl_PointSize = size * mass * 5.0;",
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

    }



  };


  module.exports = physicsParticles;

});

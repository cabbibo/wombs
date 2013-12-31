define(function(require, exports, module) {

  var SC = require("app/shaders/shaderChunks");


  var physicsParticles = {

    basicParticle:{ 

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

        THREE.ShaderChunk[ "color_pars_vertex" ],
        THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

        "void main() {",

          THREE.ShaderChunk[ "color_vertex" ],


          "vec2 lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
          "vec3 pos = texture2D( lookup, lookupuv ).rgb;",

          // position
          "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",

          "#ifdef USE_SIZEATTENUATION",
            "gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
          "#else",
            "gl_PointSize = size;",
          "#endif",

          "gl_Position = projectionMatrix * mvPosition;",

          THREE.ShaderChunk[ "worldpos_vertex" ],
          THREE.ShaderChunk[ "shadowmap_vertex" ],

        "}"

      ].join("\n"),

      fragmentShader: [

        "uniform vec3 psColor;",
        "uniform float opacity;",

        THREE.ShaderChunk[ "color_pars_fragment" ],
        THREE.ShaderChunk[ "map_particle_pars_fragment" ],
        THREE.ShaderChunk[ "fog_pars_fragment" ],
        THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

        "void main() {",

          "gl_FragColor = vec4( psColor, opacity );",

          THREE.ShaderChunk[ "map_particle_fragment" ],
          THREE.ShaderChunk[ "alphatest_fragment" ],
          THREE.ShaderChunk[ "color_fragment" ],
          THREE.ShaderChunk[ "shadowmap_fragment" ],
          THREE.ShaderChunk[ "fog_fragment" ],

        "}"

      ].join("\n")



    
    
    }


  };


  module.exports = physicsParticles;


  /*var physicsShaders = {

    particle_basic : THREE.ShaderLib['particle_basic'] = {
  
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

      THREE.ShaderChunk[ "color_pars_vertex" ],
      THREE.ShaderChunk[ "shadowmap_pars_vertex" ],

      "void main() {",

        THREE.ShaderChunk[ "color_vertex" ],


        "vec2 lookupuv = position.xy + vec2( 0.5 / 32.0 , 0.5 / 32.0 );",
        "vec3 pos = texture2D( lookup, lookupuv ).rgb;",

        // position
        "vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",

        "#ifdef USE_SIZEATTENUATION",
          "gl_PointSize = size * ( scale / length( mvPosition.xyz ) );",
        "#else",
          "gl_PointSize = size;",
        "#endif",

        "gl_Position = projectionMatrix * mvPosition;",

        THREE.ShaderChunk[ "worldpos_vertex" ],
        THREE.ShaderChunk[ "shadowmap_vertex" ],

      "}"

    ].join("\n"),

    fragmentShader: [

      "uniform vec3 psColor;",
      "uniform float opacity;",

      THREE.ShaderChunk[ "color_pars_fragment" ],
      THREE.ShaderChunk[ "map_particle_pars_fragment" ],
      THREE.ShaderChunk[ "fog_pars_fragment" ],
      THREE.ShaderChunk[ "shadowmap_pars_fragment" ],

      "void main() {",

        "gl_FragColor = vec4( psColor, opacity );",

        THREE.ShaderChunk[ "map_particle_fragment" ],
        THREE.ShaderChunk[ "alphatest_fragment" ],
        THREE.ShaderChunk[ "color_fragment" ],
        THREE.ShaderChunk[ "shadowmap_fragment" ],
        THREE.ShaderChunk[ "fog_fragment" ],

      "}"

    ].join("\n")

  }



  }

  module.exports = physicsShaders;*/

});

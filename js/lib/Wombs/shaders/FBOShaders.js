define(function(require, exports, module) {

  var SC = require("wombs/shaders/shaderChunks");

  var FBOShaders = {

    vertex:{

      basic: [
        
        "varying vec2 vUv;",

		"void main() {",

          "vUv = vec2(uv.x, 1.0 - uv.y);",
          "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}",

      ].join("\n"),

    },

    fragment:{


      dissipateFromOriginal:[
        					
        "uniform float opacity;",

        "uniform sampler2D tPositions;",
        "uniform sampler2D tOrigins;",
        
        "uniform float time;",

        // simulation
        "varying vec2 vUv;",

        SC.rand2D,

        "void main() {",

          "vec4 pos = texture2D( tPositions, vUv );",

          "float t = time/1000000.0;",
          "if ( rand( vUv + t) > 0.99 || pos.w <= 0.0 ) {",
          //"if ( pos.w < 0.0 ) {",

            "pos.xyz = texture2D( tOrigins, vUv ).xyz;",
            "pos.w = opacity;",

          "} else {",

            "if ( pos.w <= 0.0 ) discard;",

            "float x = pos.x + t * 5.0;",
            "float y = pos.y;",
            "float z = pos.z + t * 4.0;",

            "pos.x += sin( y * 0.033 ) * cos( z * 0.037 ) * 0.4;",
            "pos.y += sin( x * 0.035 ) * cos( x * 0.035 ) * 0.4;",
            "pos.z += sin( x * 0.037 ) * cos( y * 0.033 ) * 0.4;",
            "pos.w -= 0.00001;",

           // "pos = vec4( 1.0 , 1.0 , 1.0 , 1.0 );",

          "}",

          "gl_FragColor = pos;",	// write new position

        "}"
      ].join("\n"),

      
      dissipateFromOriginalAudio:[
        					
        "uniform float opacity;",

        "uniform sampler2D tPositions;",
        "uniform sampler2D tOrigins;",
        "uniform sampler2D audioTexture;",

        
        "uniform float time;",

        // simulation
        "varying vec2 vUv;",

        SC.rand2D,
        SC.audioUV,

        "void main() {",

          "vec4 pos = texture2D( tPositions, vUv );",
          "vec2 audio = audioUV( audioTexture , vUv );",
          "float t = time/1000000.0;",
          "if ( rand( vUv + t) > 0.99 || pos.w <= 0.0 ) {",
          //"if ( pos.w < 0.0 ) {",

            "pos.xyz = texture2D( tOrigins, vUv ).xyz;",
            "pos.w = opacity;",

          "} else {",

            "if ( pos.w <= 0.0 ) discard;",

            "float x = pos.x + t * 5.0;",
            "float y = pos.y;",
            "float z = pos.z + t * 4.0;",

            "pos.x += sin( y * 0.033 ) * cos( z * 0.037 ) * 0.4;",
            "pos.y += sin( x * 0.035 ) * cos( x * 0.035 ) * 0.4;",
            "pos.z += sin( x * 0.037 ) * cos( y * 0.033 ) * 0.4;",
            "pos.w -= 0.00001;",

           // "pos = vec4( 1.0 , 1.0 , 1.0 , 1.0 );",

          "}",

          "gl_FragColor = pos;",	// write new position

        "}"
      ].join("\n")



    }

    
  }

  module.exports = FBOShaders;

});

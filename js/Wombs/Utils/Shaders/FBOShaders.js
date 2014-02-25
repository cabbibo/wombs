define(function(require, exports, module) {

  var SC = require("Shaders/shaderChunks");

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


      moveAlongLine:[

        "uniform sampler2D tPositions;",
        "uniform vec3 target;",

        "uniform float speed;",

        "varying vec2 vUv;",


        "void main(){",

          "float l = length(target);",

          "vec4 pos = texture2D( tPositions, vUv );",

          "vec3 pos3 = pos.xyz;",

          "float lPos = length( pos3 );",
          "float ratio = lPos / l;",
          "if( ratio >= 1.0 ){",

          "}",

          "pos3 += normalize( dVec ) * speed;",

          "float lPos = length( pos3 );",
          "float ratio = lPos / l;",
          "if( ratio >= 1.0 ){",
            "pos3 = vec3( 0.0 , 0.0 , 0.0 );",
          "}",

          "gl_FragColor = vec4( pos3 , 1.0 );",

        "}"




      ].join("\n"),

    
      displaceSphere:[
        
        "uniform float innerRadius;",
        "uniform float outerRadius;",
            
        "uniform vec3 displacePosition;",

        "uniform sampler2D tPositions;",
        "uniform sampler2D tOrigins;",

        "uniform float displacementStrength;",
        "uniform float time;",

         
        "varying vec2 vUv;",

          "void main( void ){",
                
            "vec3 vO = texture2D( tOrigins, vUv ).rgb;", // Original position
            "vec3 v = texture2D( tPositions, vUv).rgb;", // current position


            // Getting distance between original position and displace Pos
            "vec3  dO = vO - fingerPos;",
            "vec3  nO = normalize( dO );",
            "float lO = length( dO );",
 
            // Getting distance between originalPos and currentPos
            "vec3  d = vO - v;",
            "vec3  n = vec3( 0.0 , 0.0 , 0.0 );",
            "float l = length( d );",

            "if( l < 0.01 ){",
              "l = 0.0;",
            "}",

            "vec3  dF = v - fingerPos;",
            "vec3  nF = normalize( dF );",
            "float lF = length( dF );",

            "vec3 f = vec3( 0 , 0 , 0 );",
            
            // If the particle is outside the outer radius, return it to
            // its original position
            "if( lF > outerRadius ){",
              "f = l * n;",
            "}",
            
            "if( lF <= outerRadius && lF >= innerRadius ){",
              "f = ( outerRadius - lF ) * nF;",
            "}",
            
            "if( lF < innerRadius ){",
              "f = -( lF * nF );",
            "}",

            "gl_FragColor = vec4 ( v + ( f / 100.0 ) ,  1.0);",


          "}",

        ].join("\n"),

    }

    
  }

  module.exports = FBOShaders;

});

define(function(require, exports, module) {

  var SC = require("app/shaders/shaderChunks");

  var vertexShaders = {

    audio:{


      uv:{
        
        absPos:[

          "varying vec2       vUv;",
          "varying vec3       vPos;",

          "uniform sampler2D  texture;",

          "void main() {",
             
              "vUv = uv;",    
              "vPos = position;",

              "vec3 nPos = normalize(position) * 1.0;",
              "nPos.x *=  texture2D( texture , vec2( abs(nPos.x) , 0.0 ) ).g;",
              "nPos.y *=  texture2D( texture , vec2( abs(nPos.y) , 0.0 ) ).g;",
              "nPos.z *=  texture2D( texture , vec2( abs(nPos.z) , 0.0 ) ).g;",
              "vec3 newPos = abs(nPos) * position;",
              "vec4 mvPosition = modelViewMatrix * vec4( newPos , 1.0 );",
              "gl_Position = projectionMatrix * mvPosition;",
          "}"

        ].join( "\n" ),

      },


      noise:{


        position:[

          "varying vec2       vUv;",
          "varying vec3       vPos;",

          "uniform float      time;",
          "uniform float      pow_noise;",
          "uniform float      pow_audio;",
          "uniform sampler2D  texture;",

          SC.noise3D,

          "void main() {",
             
              "vUv = uv;",    
              "vPos = position;",

              "vec3 nPos = normalize(position);",
              
              "nPos.x *=  texture2D( texture , vec2( abs(nPos.x) , 0.0 ) ).g;",
              "nPos.y *=  texture2D( texture , vec2( abs(nPos.y) , 0.0 ) ).g;",
              "nPos.z *=  texture2D( texture , vec2( abs(nPos.z) , 0.0 ) ).g;",
              "float l = length( nPos );",

              "vec3 offset = nPos * 2.0 * l +time/100.0;",

              "float d = snoise( offset );",

              "float a = ( l + 1.0 ) * pow_audio;",
              "float n = ( d + 1.0 ) * pow_noise;",
              "vec3 newPos =  n  * position;",
              "vec3 nNewPos = normalize( newPos );",
              "newPos *= a;",
              "vec4 mvPosition = modelViewMatrix * vec4( newPos , 1.0 );",
              "gl_PointSize = length( newPos ) * .5;",
              "gl_Position = projectionMatrix * mvPosition;",
          "}"

        ].join( "\n" ),



      },

      /*  :{
        
          radial:[

            "varying vec2       vUv;",
            "varying vec3       vPos;",

            "uniform sampler2D  texture;",

            "void main() {",
               
                "vUv = uv;",    
                "vPos = position;",

                "vec3 nPos = normalize(position) * 1.0;",
                "nPos.x *=  texture2D( texture , vec2( abs(nPos.x) , 0.0 ) ).g;",
                "nPos.y *=  texture2D( texture , vec2( abs(nPos.y) , 0.0 ) ).g;",
                "nPos.z *=  texture2D( texture , vec2( abs(nPos.z) , 0.0 ) ).g;",
                "vec3 newPos = abs(nPos) * position;",
                "vec4 mvPosition = modelViewMatrix * vec4( newPos , 1.0 );",
                "gl_Position = projectionMatrix * mvPosition;",
            "}"

          ].join( "\n" )


        }*/

    },

    passThrough:[

      "varying vec2 vUv;",
      "varying vec3 vPos;",
      "void main() {",
        "vUv = uv;",    // making sure to always pass through uv
        "vPos = position;",
        "gl_Position = projectionMatrix *",
                      "modelViewMatrix *",
                      "vec4(position,1.0);",
      "}"

    ].join( "\n" )



  }

  module.exports = vertexShaders;

});

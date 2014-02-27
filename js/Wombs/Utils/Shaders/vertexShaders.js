define(function(require, exports, module) {

  var SC = require("Shaders/shaderChunks");

  var vertexShaders = {

    audio:{


      uv:{
        
        absPos:[

          SC.varyingPos, 

          "uniform sampler2D  texture;",

          SC.main,

              SC.setVarying,
    

              "vec3 nPos = normalize(position) * 1.0;",
              "nPos.x *=  texture2D( texture , vec2( abs(nPos.x) , 0.0 ) ).g;",
              "nPos.y *=  texture2D( texture , vec2( abs(nPos.y) , 0.0 ) ).g;",
              "nPos.z *=  texture2D( texture , vec2( abs(nPos.z) , 0.0 ) ).g;",
              "vec3 pos = abs(nPos) * position;",

              SC.modelView, 

          SC.end

        ].join( "\n" ),

      },


      noise:{


        position0:[

          SC.varyingPos, 

          "uniform float      time;",
          "uniform float      pow_noise;",
          "uniform float      pow_audio;",
          "uniform sampler2D  texture;",

          SC.noise3D,
          SC.absAudioPosition,

          SC.main,

              SC.setVarying, 

              "vec3 aAP = absAudioPosition( texture , position );",
              "vec3 nPos = normalize(position);",
              "nPos *= aAP;",

              "float l = length( nPos );",

              "vec3 offset = nPos * 2.0 * l +time/100.0;",

              "float d = snoise3( offset );",

              "float a = ( l + 1.0 ) * pow_audio;",
              "float n = ( d + 1.0 ) * pow_noise;",
              "vec3 pos =  n  * position;",
              "vec3 nNewPos = normalize( pos );",
              "pos *= a;",

              "gl_PointSize = length( pos ) * .5;",
              
              SC.modelView,

          SC.end

        ].join( "\n" ),

        position:[

          SC.varyingPos, 

          "uniform float      time;",
          "uniform float      pow_noise;",
          "uniform float      pow_audio;",
          "uniform sampler2D  texture;",

          SC.noise3D,
          SC.absAudioPosition,

          SC.main,

              SC.setVarying, 

              "vec3 aAP = absAudioPosition( texture , position );",
              "vec3 nPos = normalize(position);",
              "nPos *= aAP;",

              "float l = length( nPos );",

              "vec3 offset = nPos * 2.0 * l +time/100.0;",

              "float d = snoise3( offset );",

              "float a = ( l + 2.0 ) * pow_audio;",
              "float n = ( d + 2.0 ) * pow_noise;",

              "gl_PointSize = length( position ) * .5;",
             
              "vec3 pos = position;",
              "vec3 noisePos = position;",
              "vec3 audioPos = position;",
              "noisePos *= a;",
              "audioPos *= n;",
              "pos += noisePos;",
              "pos += audioPos;",

              SC.modelView,
              
          SC.end

        ].join( "\n" ),


        //image:


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

    
      SC.varyingPos,
      SC.main,
      SC.setVarying,
      "vec3 pos = position;",
      SC.modelView,
      SC.end
    
    ].join( "\n" ),

    passThrough_noMV:[
    
      SC.main,
      "gl_Position = vec4(  position , 1.0 );",
      SC.end
    
    ].join( "\n" )



  }

  module.exports = vertexShaders;

});

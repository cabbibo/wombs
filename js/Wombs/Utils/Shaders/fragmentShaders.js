define(function(require, exports, module) {

  var SC = require("Shaders/shaderChunks");

  var fragmentShaders = {

    texture:[
      "uniform vec2 resolution;",
      "uniform float time;",
      "uniform sampler2D texture;",

      SC.main,
        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec4 color = texture2D( texture, uv );",
        "gl_FragColor=vec4( color );",
      SC.end
    ].join( "\n" ),

    image:[
      "uniform vec2 resolution;",
      "uniform float time;",
      "uniform sampler2D image;",
      "varying vec2 vUv;",
      SC.main,
        "vec2 uv = gl_FragCoord.xy / resolution.xy;",
        "vec4 color = texture2D( image, vUv );",
        "gl_FragColor=vec4( color );",
      SC.end
    ].join( "\n" ),
    //straightColor:
    audio:{
      color:{

        uv:{
        

          x: SC.createAudioColorShader( 'vUv.x' ),
          y: SC.createAudioColorShader( 'vUv.y' ),
          xy: SC.createAudioColorShader( '( vUv.x + vUv.y ) / 2.0' ),
          absX: SC.createAudioColorShader( 'abs(vUv.x - 0.5) * 2.0' ),
          absY: SC.createAudioColorShader( 'abs(vUv.y - 0.5) * 2.0' ),
          absXY: SC.createAudioColorShader( 'abs( vUv.y + vUv.x - 1.0 )' ),
          absDiamond: SC.createAudioColorShader( 
            'abs( vUv.y - .5) + abs( vUv.x - .5 )' 
          ),


      },


        position:{

          absDiamond:[
            "uniform sampler2D  texture;",
            "uniform vec3 color;",
            "varying vec3 vPos;",
            "varying vec2 vUv;",
           
          
            "void main( void ) {",
              "vec2 centerUV = vUv - 0.5;",
              "vec3 nPos = normalize( vPos );",
              "vec3 absPos = (abs( nPos ) * .5) +.5;",
              
              "float abs = abs( centerUV.y )  + abs(centerUV.x );",
              //"float abs = abs(vUv.y - 0.5) * 2.0;",
              "float audio = texture2D( texture , vec2( abs , 0.0 ) ).g;",
              "float r = audio * absPos.x * color.r;",
              "float g = audio * absPos.y * color.g;",
              "float b = audio * absPos.z * color.b;",
              "gl_FragColor = vec4( r , g , b , 1.0);",
            "}"
          ].join( "\n" ),


        },

        image:{

          sample_uv_diamond:[
            THREE.ShaderChunk[ "fog_pars_fragment" ],
            "uniform sampler2D texture;",
            "uniform sampler2D image;",
            "uniform vec3 color;",
            "varying vec3 vPos;",
            "varying vec2 vUv;",
            
            SC.sampleTexture,
            
            "void main( void ) {",
              "vec2 centerUV = vUv - 0.5;",
              "vec3 nPos = normalize( vPos );",
                            
              "float abs = abs( centerUV.y )  + abs(centerUV.x );",

              "float audio = texture2D( texture , vec2( abs , 0.0 ) ).a;",
              
              "vec3 audioC = audio * color.rgb;",
              "gl_FragColor = vec4( audioC.rgb , 1.0);",

              "gl_FragColor *= sampleTexture( image , vUv );",
              THREE.ShaderChunk['fog_fragment'],

            "}"
          ].join( "\n" ),

          sample_pos_diamond:[
            THREE.ShaderChunk[ "fog_pars_fragment" ],
            "uniform sampler2D texture;",
            "uniform sampler2D image;",
            "uniform vec3 color;",
            "varying vec3 vPos;",
            "varying vec2 vUv;",
            
            SC.sampleTexture,
            
            "void main( void ) {",
              "vec2 centerUV = vUv - 0.5;",
              "vec3 nPos = normalize( vPos );",
              "vec3 absPos = (abs( nPos ) * .5) +.5;",
              
              "float abs = abs( centerUV.y )  + abs(centerUV.x );",
              "float audio = texture2D( texture , vec2( abs , 0.0 ) ).g;",
              
              "vec3 audioC = audio * absPos * color.rgb;",
              "gl_FragColor = vec4( audioC.rgb , 1.0);",

              "gl_FragColor *= sampleTexture( image , vUv );",
              THREE.ShaderChunk['fog_fragment'],

            "}"
          ].join( "\n" ),

          add_uv_absDiamond:[

            THREE.ShaderChunk[ "fog_pars_fragment" ],
            "uniform sampler2D texture;",
            "uniform sampler2D image;",
            "uniform vec3 color;",
            "varying vec3 vPos;",
            "varying vec2 vUv;",
            
            SC.sampleTexture,
            
            "void main( void ) {",
              "vec2 centerUV = vUv - 0.5;",
              "vec3 nPos = normalize( vPos );",
              "vec3 absPos = (abs( nPos ) * .5) +.5;",
              
              "float abs = abs( centerUV.y )  + abs(centerUV.x );",
              "float audio = texture2D( texture , vec2( abs , 0.0 ) ).g;",
              
              "vec3 audioC = audio * absPos * color.rgb;",
              "gl_FragColor = vec4( audioC.rgb , 1.0);",

              "gl_FragColor += sampleTexture( image , vUv );",

              THREE.ShaderChunk['fog_fragment'],

            "}"
          ].join( "\n" ),


          uv_absDiamond_sub:[

            THREE.ShaderChunk[ "fog_pars_fragment" ],
            "uniform sampler2D texture;",
            "uniform sampler2D image;",
            "uniform vec3 color;",
            "varying vec3 vPos;",
            "varying vec2 vUv;",
            
            SC.sampleTexture,
            
            "void main( void ) {",
              "vec2 centerUV = vUv - 0.5;",
              "vec3 nPos = normalize( vPos );",
              "vec3 absPos = (abs( nPos ) * .5) +.5;",
              
              "float abs = abs( centerUV.y )  + abs(centerUV.x );",
              "float audio = texture2D( texture , vec2( abs , 0.0 ) ).g;",
              
              "vec3 audioC = audio * absPos * color.rgb;",
              "gl_FragColor = sampleTexture( image , vUv );;",

              "gl_FragColor -= vec4( audioC , 0.0 );",

              THREE.ShaderChunk['fog_fragment'],

            "}"
          ].join( "\n" ),

          
          sub_uv_absDiamond:[

            THREE.ShaderChunk[ "fog_pars_fragment" ],
            "uniform sampler2D texture;",
            "uniform sampler2D image;",
            "uniform vec3 color;",
            "varying vec3 vPos;",
            "varying vec2 vUv;",
            
            SC.sampleTexture,
            
            "void main( void ) {",
              "vec2 centerUV = vUv - 0.5;",
              "vec3 nPos = normalize( vPos );",
              "vec3 absPos = (abs( nPos ) * .5) +.5;",
              
              "float abs = abs( centerUV.y )  + abs(centerUV.x );",
              "float audio = texture2D( texture , vec2( abs , 0.0 ) ).g;",
              
              "vec3 audioC = audio * absPos * color.rgb;",
              "gl_FragColor = vec4( audioC.rgb , 1.0);",

              "gl_FragColor -= sampleTexture( image , vUv );",

              THREE.ShaderChunk['fog_fragment'],

            "}"
          ].join( "\n" ),



        },

      }

    }

  }


  module.exports = fragmentShaders;

});

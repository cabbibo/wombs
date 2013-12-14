define(function(require, exports, module) {

  var fragmentShaders = {

    audio:{
    color:{

      uv:{

        x:[
          "uniform sampler2D  texture;",
          "uniform vec3 color;",
          "varying vec2 vUv;",

          "void main( void ) {",
            "float audio = texture2D( texture , vec2( vUv.x , 0.0 ) ).g;",
            "float r = audio * color.r;",
              "float g = audio * color.g;",
              "float b = audio * color.b;",
              "gl_FragColor = vec4( r , g , b , 1.0 );",
            "}"
          ].join( "\n" ),


          y:[
            "uniform sampler2D  texture;",
            "uniform vec3 color;",
            "varying vec2 vUv;",

            "void main( void ) {",
              "float audio = texture2D( texture , vec2( vUv.y , 0.0 ) ).g;",
              "float r = audio * color.r;",
              "float g = audio * color.g;",
              "float b = audio * color.b;",
              "gl_FragColor = vec4( r , g , b , 1.0 );",
            "}"
          ].join( "\n" ),

          xy:[
            "uniform sampler2D  texture;",
            "uniform vec3 color;",
            "varying vec2 vUv;",

            "void main( void ) {",
              "float audio = texture2D( texture , vec2( ( vUv.x + vUv.y ) / 2.0 , 0.0 ) ).g;",
              "float r = audio * color.r;",
              "float g = audio * color.g;",
              "float b = audio * color.b;",
              "gl_FragColor = vec4( r , g , b , 1.0 );",
            "}"
          ].join( "\n" ),

          absX:[
            "uniform sampler2D  texture;",
            "uniform vec3 color;",
            "varying vec2 vUv;",
            
            "void main( void ) {",
              "float abs = abs(vUv.x - 0.5) * 2.0;",
              "float audio = texture2D( texture , vec2( abs , 0.0 ) ).g;",
              "float r = audio * color.r;",
              "float g = audio * color.g;",
              "float b = audio * color.b;",
              "gl_FragColor = vec4( r , g , b , 1.0 );",
            "}"
          ].join( "\n" ),

          absY:[
            "uniform sampler2D  texture;",
            "uniform vec3 color;",
            "varying vec2 vUv;",
            
            "void main( void ) {",
              "float abs = abs(vUv.y - 0.5) * 2.0;",
              "float audio = texture2D( texture , vec2( abs , 0.0 ) ).g;",
              "float r = audio * color.r;",
              "float g = audio * color.g;",
              "float b = audio * color.b;",
              "gl_FragColor = vec4( r , g , b , 1.0 );",
            "}"
          ].join( "\n" ),
          
          absXY:[
            "uniform sampler2D  texture;",
            "uniform vec3 color;",
            "varying vec2 vUv;",
            
            "void main( void ) {",
              "float abs = abs( vUv.y + vUv.x - 1.0 );",
              //"float abs = abs(vUv.y - 0.5) * 2.0;",
              "float audio = texture2D( texture , vec2( abs , 0.0 ) ).g;",
              "float r = audio * color.r;",
              "float g = audio * color.g;",
              "float b = audio * color.b;",
              "gl_FragColor = vec4( r , g , b , 1.0 );",
            "}"
          ].join( "\n" ),

          absDiamond:[
            "uniform sampler2D  texture;",
            "uniform vec3 color;",
            "varying vec2 vUv;",
            
            "void main( void ) {",
              "vec2 centerUV = vUv - 0.5;",
              "float abs = abs( centerUV.y )  + abs(centerUV.x );",
              //"float abs = abs(vUv.y - 0.5) * 2.0;",
              "float audio = texture2D( texture , vec2( abs , 0.0 ) ).g;",
              "float r = audio * color.r;",
              "float g = audio * color.g;",
              "float b = audio * color.b;",
              "gl_FragColor = vec4( r , g , b , 1.0 );",
            "}"
          ].join( "\n" ),

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




        }

      }

    }

  }


  module.exports = fragmentShaders;

});

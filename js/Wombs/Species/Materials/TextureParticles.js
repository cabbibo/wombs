/*
 


*/

define(function(require, exports, module) {
 
  var Womb                = require( 'Womb/Womb'                  );

  var m                   = require( 'Utils/Math'                 );

  var fragmentShaders     = require( 'Shaders/fragmentShaders'    );
  var vertexShaders       = require( 'Shaders/vertexShaders'      );
  var shaderChunks        = require( 'Shaders/shaderChunks'       );

  
  function TextureParticles( womb , parameters ){

    womb.loader.addToLoadBar();

    var params = _.defaults( parameters || {} , {

      texture: womb.defaults.texture
 
    });
   
      
    var uniforms = {

      texture: { type:"t" , value: params.texture }

    }

    var vertexShader = [

      "uniform sampler2D texture;",
      
      "varying vec2 vUv;",

      "void main(){",

          "vUv = uv;",

          "vec3 pos = position;",
          //"pos = texture2D( texture , uv ).xyz;",

          //"gl_PointSize = 5.0 ;",

          //"pos *= 10.0;",
          shaderChunks.modelView,

      "}"


    ].join("\n" );

    var fragmentShader = [

      "uniform sampler2D texture;",
      "varying vec2 vUv;",

      "void main(){",

        "vec4 color = texture2D( texture , vUv );",
      
        //"gl_FragColor = vec4( vUv.x , 1.0 , 1.0 , 1.0 );",

        "gl_FragColor = color;",

      "}"


    ].join("\n");

 
    var material;

    if( params.additive ){
      
      material = new THREE.ShaderMaterial({

        uniforms        : uniforms,       
        vertexShader    : vertexShader,
        fragmentShader  : fragmentShader,
     

        depthTest       : false,
        side            : THREE.DoubleSide,
        blending        : THREE.AdditiveBlending,
        transparent     : true,
   
      
      });

    }else{

      material = new THREE.ShaderMaterial({

        uniforms        : uniforms,       
        vertexShader    : vertexShader,
        fragmentShader  : fragmentShader,
      
      });

    }

    material.params = params;

    material._update = function(){
     
    }
 
    womb.loader.loadBarAdd();

    return material;

  }

  module.exports = TextureParticles;

});

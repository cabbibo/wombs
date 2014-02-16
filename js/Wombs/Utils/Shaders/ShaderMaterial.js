define(function(require, exports, module) {


  require( 'lib/three.min' );


  function ShaderMaterial( params ){
    var params = _.defaults( parameters || {} , {

      fog: true,
      lights: true

    });


    constructUniforms,  
    constructVertShader
    constructFragShader,


    
    contructFragShader

    audioFragShader.getUniforms();
    audioFragShader.getVaryings();

    /*
     
       look for all things using vB

    */


  }

  function getVarying(){

    loop through this

      if( there is a string that has "vB" )



  }

  frag = {

    mutations:

  }


  frag.get(){


    return concatenated Chunk
  }

  frag.addMutation(parmas){

    params = _.defaults({} || {

      chunk:
      uniforms:
      varyings:

    });




  function addCats(){


    this.
  }
  ShaderMaterial.prototype.constructUniforms = function(){

    var uniforms =  
     

    THREE.UniformsLib[ "common" ],
    THREE.UniformsLib[ "bump" ],
    THREE.UniformsLib[ "normalmap" ],
    THREE.UniformsLib[ "fog" ],
    THREE.UniformsLib[ "lights" ],
    THREE.UniformsLib[ "shadowmap" ],
   
    var uniforms = {}
    for( var i = 0; i < uniformArray.length; i++ ){

      THREE.UniformsUtils.merge( uniformArray[i] );
          
          
    }
    
    THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        womb.u,
    ]);

  }

  ShaderMaterial.prototype.setUniforms = function( uniforms ){

  }

  module.exports = ShaderMaterial;

});

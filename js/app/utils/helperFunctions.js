define(function(require, exports, module) {

  require( 'lib/three' );

  var helperFunctions = {


    setParameters: function( object , parameters ){

      for( var propt in parameters ){

        //if( object[propt] ){
          object[ propt ] = parameters[ propt ];
        //}else{
       //   console.log( 'No propt for this object' );
       // }
  
      }

    },

    setMaterialUniforms: function( material , parameters ){

      for( var propt in parameters ){

        if( material.uniforms[propt] ){

          console.log('Propt true' );
          console.log( propt );
          console.log(  material.uniforms[propt] );
          console.log( parameters[propt] );
          material.uniforms[propt].value = parameters[propt];

        }else{
          console.log( 'Problem' );
          console.log( propt );
        }
       
      }

    }



  }

  
  module.exports = helperFunctions;

});

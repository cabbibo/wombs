define( function( require , exports , module ){

  require( 'lib/shaders/ConvolutionShader'      );
  require( 'lib/shaders/CopyShader'             );
  require( 'lib/shaders/DotScreenShader'        );
  require( 'lib/postprocessing/ShaderPass'      );
  require( 'lib/postprocessing/TexturePass'     );
  require( 'lib/postprocessing/EffectComposer'  );
  require( 'lib/postprocessing/RenderPass'      );
  require( 'lib/postprocessing/MaskPass'        );
  require( 'lib/postprocessing/BloomPass'       );

  function EffectComposer( world , params ){
    
    this.params = _.defaults( params || {} , {

      effectArray : [ [ 'bloomPass' , [] ] ]

    });

    this.world  = world;
    this.womb   = world.womb;

    console.log('s');
    console.log( );
    console.log( world.renderer );
    console.log( world.scene , world.camera );


    this.composer = new THREE.EffectComposer( world.renderer );

    var effect2 = new THREE.RenderPass( world.scene , world.camera );
    //effect.renderToScreen = true;
    this.composer.addPass( effect2 );


    //var effect = new THREE.TexturePass( this.composer.renderTarget );
    //this.composer.addPass( effect );

    /*var effect = new THREE.ShaderPass( THREE.DotScreenShader );
    effect.uniforms[ 'scale' ].value = 4;
    effect.renderToScreen = true;
    this.composer.addPass( effect );*/

    for( var i = 0; i < this.params.effectArray.length; i ++ ){

      var e = this.params.effectArray[i];
      var effect1;
      if( e[0] == 'bloomPass' ){

        console.log('ssss');
        //console.log( THREE );
        //console.log( THREE.BloomPass );
        effect1 = new THREE.BloomPass(.5);
        //effect = new THREE.ShaderPass( THREE.ConvolutionShader ); 
      }


      //this.composer.addPass( effect1 );

    }

    var effect4 = new THREE.ShaderPass( THREE.CopyShader );
    effect4.renderToScreen = true;
    console.log( effect4 );
    console.log( this.composer );
    this.composer.addPass( effect4 )

  }

  EffectComposer.prototype.render = function(){

    this.composer.render();

  }


  module.exports = EffectComposer;

});

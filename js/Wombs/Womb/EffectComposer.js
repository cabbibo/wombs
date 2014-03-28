define( function( require , exports , module ){


  require( 'Wagner/Wagner' );
  
  
  function EffectComposer( womb , params ){
    
    this.params = _.defaults( params || {} , {

      effectArray : [ [ 'bloomPass' , [] ] ]

    });


    this.womb = womb;

    var composer = new WAGNER.Composer( womb.renderer );
    composer.setSize( window.innerWidth * womb.dpr , window.innerHeight*womb.dpr ); // or whatever resolution

        this.multiPassBloomPass = new WAGNER.MultiPassBloomPass();
    this.invertPass=new WAGNER.InvertPass();
    this.boxBlurPass=new WAGNER.BoxBlurPass();
    this.fullBoxBlurPass=new WAGNER.FullBoxBlurPass();
    this.zoomBlurPass=new WAGNER.ZoomBlurPass();
    this.multiPassBloomPass=new WAGNER.MultiPassBloomPass();
    this.denoisePass=new WAGNER.DenoisePass();
    this.sepiaPass=new WAGNER.SepiaPass();
    this.noisePass=new WAGNER.NoisePass();
    this.vignettePass=new WAGNER.VignettePass();
    this.vignette2Pass=new WAGNER.Vignette2Pass();
    this.CGAPass=new WAGNER.CGAPass();
    //edgeDetectionPass=new WAGNER.EdgeDetectionPass();
    this.dirtPass=new WAGNER.DirtPass();
    this.blendPass=new WAGNER.BlendPass();
    this.guidedFullBoxBlurPass=new WAGNER.GuidedFullBoxBlurPass();
    //SSAOPass=new WAGNER.SSAOPass();

    this.womb.renderer.autoClearColor = true;


    this.composer = composer;

  }

  EffectComposer.prototype.render = function(){


    this.composer.reset();

    this.composer.render( this.womb.scene , this.womb.camera );

    this.composer.pass( this.noisePass );

    //this.composer.pass( this.CGAPass );
    //this.composer.pass( this. );
    this.composer.pass( this.zoomBlurPass );
    //this.composer.pass( this.fullBoxBlurPass );
    this.composer.pass( this.multiPassBloomPass );
    //this.composer.pass( this.multiPassBloomPass );
   // this.composer.pass( this.invertPass );

    this.composer.toScreen();

  }


  module.exports = EffectComposer;

});

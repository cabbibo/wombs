define(function(require, exports, module) {

  require = ( 'lib/three.min' );
  
  function ImageLoader( womb , params ){

    this.womb = womb;

    this.loader = THREE.ImageUtils;


  }


  ImageLoader.prototype.load = function( file , callback , mapping ){



    this.womb.loader.addToLoadBar();

    if( !mapping ) mapping = THREE.UVMapping;
    var self = this;
    var texture = this.loader.loadTexture( file , mapping , function( texture ){

      self.womb.loader.loadBarAdd();
      
      if( callback )
        callback( texture );

    });

    return texture;


  }



  module.exports = ImageLoader;

});


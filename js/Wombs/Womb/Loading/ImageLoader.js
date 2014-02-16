define(function(require, exports, module) {

  require( 'lib/three.min' );
  
  function ImageLoader( womb , params ){

    this.womb = womb;

    this.loader = THREE.ImageUtils;


  }


  ImageLoader.prototype.load = function( file , callback , mapping ){


   
    var texture;
    

    // One for THREE load, and other for DOM load
    this.womb.loader.addToLoadBar();
    this.womb.loader.addToLoadBar();

    if( !mapping ) mapping = THREE.UVMapping;
  
    var self = this;
    texture = this.loader.loadTexture( file , mapping , function( texture ){

      self.womb.loader.loadBarAdd();
      
      if( callback )
        callback( texture );

    });

    // Assigns a width and height scaled textures
    // Console log a ratio for easy computing!
    var img = document.createElement( 'img' );
    img.src = file;
    img.onload = function(){
      
      self.womb.loader.loadBarAdd();

      texture.width = this.width;
      texture.height = this.height;

      texture.ratio = this.width/this.height;

      //console.log( texture.ratio )
    }


    return texture;


  }



  module.exports = ImageLoader;

});


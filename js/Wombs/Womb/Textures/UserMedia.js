define(function(require, exports, module) {

  var VideoTexture = require( 'Womb/Textures/VideoTexture' );
  
  function UserMedia( params ){


    this.params = _.defaults( params || {}, {
      texture:       true,
    });

    womb.loader.addToLoadBar();

    this.video = document.createElement('video');
    this.video.width    = 320;
    this.video.height   = 240;
    this.video.autoplay = true;

    
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var constraints = {
      video: true,
      audio: false,
    };

    // TODO: Switch to video texture
    this.texture = new THREE.Texture();

    texture.video = video;
    texture.womb  = womb;

    navigator.getUserMedia( 
      constraints , 
      successCallback.bind( texture ) , 
      errorCallback.bind(   texture ) 
    );

    return texture;

  }


 successCallback = function(  stream ){

    this.womb.loader.loadBarAdd();
    
    this.video.src = webkitURL.createObjectURL(stream);
    this.image = this.video;

    this.womb.addToUpdateArray( _update.bind( this ) );

    onTextureCreated.bind( this );
  }

  onTextureCreated = function(){}

  errorCallback = function( error ){

    this.womb.loader.addFailure( 
      'User Media Not Created' , 
      'http://www.html5rocks.com/en/tutorials/getusermedia/intro/'
    );
   

  }

  _update = function(){

    if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ){
      this.needsUpdate = true;
    }

    update();
  }

  update = function(){};



  module.exports = UserMediaTexture;

});


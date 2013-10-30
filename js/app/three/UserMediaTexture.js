define(function(require, exports, module) {

  function UserMediaTexture( world ){


    
    this.world  = world;
    this.womb   = world.womb;

    this.womb.loader.numberToLoad ++;


    this.video = document.createElement('video');
    this.video.width    = 320;
    this.video.height   = 240;
    this.video.autoplay = true;

    
    var hasUserMedia = navigator.webkitGetUserMedia ? true : false;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var constraints = {
      video: true,
      audio: false,
    };

    navigator.getUserMedia( 
      constraints , 
      this.successCallback.bind( this ) , 
      this.errorCallback.bind( this ) 
    );

  }


  UserMediaTexture.prototype.successCallback = function( stream ){

    this.womb.loader.loadBarAdd();
    
    this.video.src = webkitURL.createObjectURL(stream);
    this.videoTexture = new THREE.Texture( this.video );

    this.material   = new THREE.MeshLambertMaterial({
      map : this.videoTexture
    });

    this.onTextureCreated();
  }

  UserMediaTexture.prototype.onTextureCreated = function(){}

  UserMediaTexture.prototype.errorCallback = function( error ){

    console.log( 'It Faileeeed' );
    console.log( error );

  }

  UserMediaTexture.prototype._update = function(){

    if( this.video.readyState === this.video.HAVE_ENOUGH_DATA ){
      this.videoTexture.needsUpdate = true;
    }

    this.update();
  }

  UserMediaTexture.prototype.update = function(){};



  module.exports = UserMediaTexture;

});


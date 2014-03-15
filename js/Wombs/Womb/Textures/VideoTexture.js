define(function(require, exports, module) {

  function VideoTexture( womb , params ){
  
    this.womb             = womb;

    this.params = _.defaults( params || {}, {

      width: 640,
      height: 480,
      file: '/lib/video/sintel.mp4',

      showOriginalVideo: false,

    });


    this.width  = this.params.width;
    this.height = this.params.height;

    this.video  = document.createElement( 'video' );

    this.video.width          = this.width;
    this.video.height         = this.height;

    this.video.src = this.params.file;

    this.video.type = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';

    this.video.load();

    if( params.showOriginalVideo ){
      document.body.appendChild( this.video );
      this.video.style.zIndex   = '999';
      this.video.style.position = 'absolute';
    }



    this.videoImage = document.createElement( 'canvas' );
	this.videoImage.width     = this.width;
	this.videoImage.height    = this.height;

	this.videoImageContext = this.videoImage.getContext( '2d' );
	// background color if no video present
	this.videoImageContext.fillStyle = '#ff0000';
	this.videoImageContext.fillRect( 0 , 0 , this.width , this.height );

    this.videoTexture = new THREE.Texture( this.videoImage );
	this.videoTexture.minFilter = THREE.LinearFilter;
	this.videoTexture.magFilter = THREE.LinearFilter;
    
    
    
    this.texture = new THREE.Texture( this.video );

    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.format = THREE.RGBFormat;
    this.texture.generateMipmaps = false;


  }

  VideoTexture.prototype.play = function(){
    this.video.load();
    this.video.play();
  }


  VideoTexture.prototype._update = function(){

    //console.log( 'HELLO' );
      if ( this.video.readyState === this.video.HAVE_ENOUGH_DATA ) {

        if ( this.texture ) this.texture.needsUpdate = true;

      }
    

  }

  module.exports = VideoTexture;

});

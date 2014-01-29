define(function(require, exports, module) {

  var AudioTexture = require( 'Womb/Textures/AudioTexture' );

  function UserAudio( controller , params ){
 


    this.controller = controller;
    this.womb       = this.controller.womb;
    this.params = _.defaults( params || {}, {
        
      fbc:            128,
      texture:       true,

    });

    this.womb.loader.numberToLoad ++;

    this.analyser = this.controller.ctx.createAnalyser();
    this.filter   = this.controller.ctx.createBiquadFilter();
    this.gain     = this.controller.ctx.createGain();

    this.analyser.frequencyBinCount = this.params.fbc;
    this.analyser.array = new Uint8Array( this.params.fbc );



    this.controller = controller;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    var constraints = {
      audio: true,
    };

    if( this.params.texture ){
      this.texture  = new AudioTexture( this ); 
    }


    navigator.getUserMedia( constraints , this.successCallback.bind( this ) , this.errorCallback.bind( this ) );


       
  }
  
  UserAudio.prototype.successCallback = function( stream ) {
   
    this.womb.loader.loadBarAdd();
   
    window.stream = stream; // stream available to console

    this.source = this.controller.ctx.createMediaStreamSource( stream );

    this.filterOn = false;
    this.source.connect(                   this.analyser );
    this.analyser.connect(                     this.gain );
    this.gain.connect(        this.controller.compressor );

    this.onStreamCreated();

  }


  UserAudio.prototype.onStreamCreated = function(){};

  UserAudio.prototype.errorCallback = function (error){
    console.log("navigator.getUserMedia error: ", error);
  }

  UserAudio.prototype.turnOffFilter = function(){
    this.filterOn = false;
    this.filter.disconnect(0);
    this.source.disconnect( 0 );
    this.source.connect( this.gain );
  }

  UserAudio.prototype.turnOnFilter = function(){
    this.filterOn = true;
    this.source.disconnect( 0 );
    this.source.connect( this.filter );
    this.filter.connect( this.gain );
  }

  UserAudio.prototype._update = function(){

    this.analyser.getByteFrequencyData( this.analyser.array );
    
    if( this.texture )
      this.texture.update();
    
    this.update();

  }

  UserAudio.prototype.update = function(){

  }




  return UserAudio;

});


define(function(require, exports, module) {

  var AudioTexture = require( 'Womb/Textures/AudioTexture' );

  function Stream( controller , file , params ){

    this.params = _.defaults( params || {}, {
        
      loop:      false,
      fbc:           1024,
      fadeTime:         1, 
      texture:       true,
      preload:      false

    });

    this.controller = controller;
    this.file       = file;

    this.playing    = false;

    this.looping    = this.params.looping;

    this.createSource();


    if( this.params.texture ){

      this.texture = new AudioTexture( this );

    }

  }

  Stream.prototype.createAudio  = function(){
    
    this.audio          = new Audio();
    
    if( this.params.preload )
      this.audio.preload  = 'auto';
    else
      this.audio.preload  = 'none';

    this.audio.src      = this.file;
    this.audio.loop     = this.params.loop;


  }

  Stream.prototype.play = function(){
 
    // TODO: Need to wait for tiny timeout EVERY time.
    // YYYYY?!?!?!!?
    //console.log( 'PLAYING' );
    //if( !this.audio ) {

      var self = this;

      //doing tiny timeout or for some reason
      //song won't play.. TODO: Investigate
      setTimeout(function(){
        if(!self.source){
            self.createSource();
            self.audio.play();
            
        }else{
         
            self.audio.play();
        }
        self.playing = true;
      },10);

    //}else{

    //  this.audio.play();

    //}

  }

  Stream.prototype.stop = function(){
  
    this.audio.pause();

  }

  Stream.prototype.createSource = function() {
 
    this.createAudio();

    this.source         = this.controller.ctx.createMediaElementSource( this.audio );
           
    this.filterOn       = false;
    this.filter         = this.controller.ctx.createBiquadFilter();
    this.analyser       = this.controller.ctx.createAnalyser();
    this.analyser.array = new Uint8Array( this.params.fbc );
    this.gain           = this.controller.ctx.createGain();

    this.source.connect( this.gain  );
    this.gain.connect( this.analyser );

    if( this.looping ){
      this.analyser.connect( this.controller.loops.gain );
    }else{
      this.analyser.connect( this.controller.notes.gain );
    }

  };

  Stream.prototype.destroySource = function(){
      
    this.source.disconnect(this.gain);
    this.analyser.disconnect(this.gain);
    this.source = undefined;
    this.analyser = undefined;

  };

  Stream.prototype.fadeOut = function( time ){
 
    var t = this.controller.ctx.currentTime;
    if( !time ) time = this.params.fadeTime;
    this.gain.gain.linearRampToValueAtTime( this.gain.gain.value , t );
    this.gain.gain.linearRampToValueAtTime( 0.0 , t + time );

  }
  
  Stream.prototype.fadeIn = function( time , value ){
  
    if( !time  ) time  = this.params.fadeTime;
    if( !value ) value = 1;

    console.log( this.gain.gain );
    this.gain.gain.linearRampToValueAtTime( 1 , this.controller.ctx.currentTime + time );

  }

  Stream.prototype.turnOffFilter = function(){
    this.filterOn = false;
    this.filter.disconnect(0);
    this.source.disconnect( 0 );
    this.source.connect( this.gain );
  }

  Stream.prototype.turnOnFilter = function(){
    this.filterOn = true;
    this.source.disconnect( 0 );
    this.source.connect( this.filter );
    this.filter.connect( this.gain );
  }


  Stream.prototype._update = function(){

    this.analyser.getByteFrequencyData( this.analyser.array );

    if( this.texture )
      this.texture.update();


    this.update();

  }

  Stream.prototype.update = function(){

  }

  module.exports = Stream;

});

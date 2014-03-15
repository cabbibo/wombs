
// TODO: make everything part of the updateArray

define(function(require, exports, module) {


  var Audio         = require( 'Womb/Audio/Audio'      );
  var UserAudio     = require( 'Womb/Audio/UserAudio'  );
  var Stream        = require( 'Womb/Audio/Stream'     );
  var Looper        = require( 'Womb/Audio/Looper'     );
 
  var AudioTexture  = require( 'Womb/Textures/AudioTexture' );


  function AudioController( womb , params ){
  
    this.params = _.defaults( params || {}, {
        
      fbc:       1024,        // frequency bin count for all analysers
      bpm:        100,        // You gotta know how fast your track is!
      texture:   true

    });


    /*
        CREATION
    */
    this.womb = womb;

    this.womb.loader.detectWebAudioAPI();
 
    this.ctx      = new AudioContext();

    // Start with the filter off
    this.filterOn   = false;
    this.filter     = this.ctx.createBiquadFilter();
    this.compressor = this.ctx.createDynamicsCompressor();
    this.gain       = this.ctx.createGain();
    this.analyser   = this.ctx.createAnalyser();

    this.analyser.frequencyBinCount = this.params.fbc;
    this.analyser.array = new Uint8Array( this.params.fbc );
   

    if( this.params.texture )
      this.texture = AudioTexture( this );


    this.loops = {

      array:        [],
      analyser:     this.ctx.createAnalyser(),
      gain:         this.ctx.createGain()

    }

    this.notes = {

      array:        [],
      analyser:     this.ctx.createAnalyser(),
      gain:         this.ctx.createGain()

    }


    // Events to be Called on update
    this.updateArray = [];


    /*
        WIRING
    */

    this.compressor.connect(                     this.gain );
    this.gain.connect(                       this.analyser );
    this.analyser.connect(            this.ctx.destination );

    this.loops.gain.connect(           this.loops.analyser );
    this.loops.analyser.connect(           this.compressor );

    this.notes.gain.connect(           this.notes.analyser );
    this.notes.analyser.connect(           this.compressor );


  }


  AudioController.prototype.toggleFilter = function(){

    if( this.filterOn ){
      this.filterOn = false;
      this.filter.disconnect(0);
      this.compressor.disconnect( 0 );
      this.compressor.connect( this.gain );
    }else{
      this.filterOn = true;
      this.compressor.disconnect( 0 );
      this.compressor.connect( this.filter );
      this.filter.connect( this.gain );
    }

  }

  AudioController.prototype.turnOffFilter = function(){
    
    this.filterOn = false;
    this.filter.disconnect(0);
    this.compressor.disconnect( 0 );
    this.compressor.connect( this.gain );
  
  }

  AudioController.prototype.turnOnFilter = function(){
  
    this.filterOn = true;
    this.compressor.disconnect( 0 );
    this.compressor.connect( this.filter );
    this.filter.connect( this.gain );
  
  }

  AudioController.prototype.createUserAudio = function( params ){
    this.userAudio = new UserAudio( this , params );
    return this.userAudio;
  }

  AudioController.prototype.createStream = function( file , params ){
    this.stream = new Stream( this , file , params );
    return this.stream;
  }

  AudioController.prototype.createLoop = function( file, params ){
    
    var p = params;
    if(!p) p = {};
    p.looping = true;

    var loop  = new Audio( this , file , p );
    this.loops.array.push( loop );

    return loop;
    
  }

  AudioController.prototype.createNote = function( file, params ){

    var note  = new Audio( this , file , params);
    this.notes.array.push( note );

    return note;

  }



  AudioController.prototype.createLooper = function( audio , params ){

    var looper = new Looper( audio , this , params );

    return looper;


  }


  AudioController.prototype.fadeOut = function( time ){
 
    var t = this.ctx.currentTime;
    if( !time ) time = this.params.fadeTime;
    this.gain.gain.linearRampToValueAtTime( this.gain.gain.value , t );
    this.gain.gain.linearRampToValueAtTime( 0.0 , t + time );

  }
  
  AudioController.prototype.fadeIn = function( time , value ){
  
    if( !time  ) time  = this.params.fadeTime;
    if( !value ) value = 1;

    console.log( this.gain.gain );
    this.gain.gain.linearRampToValueAtTime( 1 , this.ctx.currentTime + time );

  }


  AudioController.prototype.fadeOutLoops = function( time ){

    for( var i = 0 ; i < this.loops.array.length; i++ ){
      this.loops.array[i].fadeOut( time );
    }
  
  }

  AudioController.prototype.fadeInLoops = function( time , value ){

    for( var i = 0 ; i < this.loops.array.length; i++ ){
      this.loops.array[i].fadeIn( time , value );
    }
  
  }



  AudioController.prototype.playAllLoops = function(){

    for( var i = 0; i < this.loops.array.length; i++ ){
      this.loops.array[i].play();
    }

  }



  AudioController.prototype._update = function(){

    this.analyser.getByteFrequencyData( this.analyser.array );
    this.update();

    if( this.texture )
      this.texture.update();

    for( var i = 0; i < this.updateArray.length; i++ ){

      this.updateArray[i]();

    }


    if ( this.stream ){
      this.stream._update();
    }

    if( this.track ){
      this.track._update();
    }

    if( this.userAudio ){
      this.userAudio._update();
    }

    for( var i = 0; i < this.loops.array.length; i++ ){
      this.loops.array[i]._update();
    }

    for( var i = 0; i < this.notes.array.length; i++ ){
      this.notes.array[i]._update();
    }

  }

  AudioController.prototype.update = function(){

  }

  AudioController.prototype.addToUpdateArray = function( callback ){
    this.updateArray.push( callback );
  }

  return AudioController

});

// TODO:
// Create a loopable object, that updates every frame, getting the delta
// and seeing if the time is past the time needed for each frame.
// make sure to make triplets and everything else usablue
//
// Starting with just 4 / 4

define(function(require, exports, module) {

  function Looper( audio , controller , params ){

    this.controller = controller;
    this.params = _.defaults( params || {}, {
        
      beatsPerMinute:     120,
      beatsPerMeasure:      4,
      beatType:             4,

    });

    this.audio = audio;

    this.beatsPerMinute = this.params.beatsPerMinute;
    this.bpm = this.beatsPerMinute;

    this.beatsPerSecond = this.bpm / 60;
    this.bps = this.beatsPerSecond;

    this.measureLength = this.bps * this.beatsPerMeasure;

    this.timeInMeasure = 0;
    this.percentOfMeasure = 0;
    this.oPercentOfMeasure = 0;
    


    this.controller.addToUpdateArray( this._update.bind( this ) );


  }

  Looper.prototype._update = function(){

    if( this.audio.playing ){
      console.log('Playing');  


      
      this.checkHits();

    }else{
      console.log('stopped');
    }

    this.update();
  
  }

  Looper.prototype.update = function(){};

  Looper.prototype.addHit = function( callback , params ){

    var hit = []
    hit.params = _.defaults( params || {}, {
      
      measureFrequency:  1,
      
      measureOffset:     0,
      duration        [0 , 1000000000 ],
      
      
    });

    hit[0] = newParams.measureFrequency;
    hit[1]



    this.hits.push( this );

  }


  module.exports = Looper;

});

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

    this.secondsPerBeat = 1 / this.bps;
    this.spb = this.secondsPerBeat;

    this.beatsPerMeasure = this.params.beatsPerMeasure;

    this.measureLength = this.spb * this.beatsPerMeasure;

    this.measure            = 0;
    this.oMeasure           = 0;

    this.timeInMeasure      = 0;
    this.totalTime          = 0;
    this.percentOfMeasure   = 0;
    this.oPercentOfMeasure  = 0;    

    this.hits = [];

    this.controller.addToUpdateArray( this._update.bind( this ) );


  }

  Looper.prototype._update = function(){

    if( this.audio.playing ){
      
      this.updateTime();
      this.checkHits();

    }else{


    }

    this.update();
  
  }

  Looper.prototype.update = function(){};

  Looper.prototype.updateTime = function(){
    
    this.newMeasure = false;

    this.oPercentOfMeasure = this.percentOfMeasure;

    this.timeInMeasure = this.audio.time - this.totalTime;
    this.percentOfMeasure = this.timeInMeasure / this.measureLength;


    if(  this.percentOfMeasure >= 1.0 ){

      this.oMeasure = this.measure;
      this.measure +=1;
      this.totalTime = this.measure * this.measureLength;

      this.newMeasure = true;

    }


  }

  Looper.prototype.addHit = function( callback , params ){

    var hit = _.defaults( params || {}, {
      
      callback:           callback,
     
      percents:        [ .0 , .25 , .50 , .75 ],
      measureFrequency:   1,
      measureOffset:      0,
      duration:           [ 0 , 1000000000 ],
      
    });


    this.hits.push( hit );

  }

  Looper.prototype.addSequence = function( callback , sequenceLength , hitArray , duration ){

    for( var i = 0; i < hitArray.length; i++ ){

      if( !duration ) duration = [0 , 10000000000 ];
      this.addHit( callback , {

        measureFrequency: sequenceLength,
        measureOffset:    hitArray[i][0],
        percents:         hitArray[i][1],
        duration:         duration

      });

    }



  }

  Looper.prototype.checkHits = function(){

    for( var i = 0; i < this.hits.length; i++ ){

      var hit = this.hits[i];

      var t = this.audio.time;

      // only check if within the duration of hit
      if( t >= hit.duration[0] && t <= hit.duration[1] ){

        // only check if on proper measure
        if( this.measure % hit.measureFrequency == hit.measureOffset ){

          for( var j = 0; j < hit.percents.length; j ++ ){

            var p = hit.percents[j];

            if( 
              this.percentOfMeasure  >= p && 
              this.oPercentOfMeasure < p 
            ){

              
              hit.callback();

            // In this case the percentage is at 0
            }else if( p == 0 && this.newMeasure ){

              hit.callback();

            }

          }

        }

      }

    }


  };

  module.exports = Looper;

});

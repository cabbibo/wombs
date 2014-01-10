define(function(require, exports, module) {

  var a = require( 'lib/Tween'  );


  function Tweener( womb , params ){

    this.womb = womb;

    this.params = _.defaults( params || {}, {

    });


    this.tweens   = [];
    this.tweening = false;


  }


  // TODO: FIXXX
  Tweener.prototype.tweenAtTime = function( tween , time ){

    //this.womb.events

  }

  Tweener.prototype.createTween = function( p ){

    var params = _.defaults( p || {}, {
      easing:   TWEEN.Easing.Exponential.InOut,
      time:     1,
      type: 'position',
      callback: function(){}
    });

    var initial , target;

    if( params.type == 'position' ){

      initial = {
        x: params.object.position.x,    
        y: params.object.position.y,
        z: params.object.position.z
      }

      target = {
        x: params.target.x,
        y: params.target.y,
        z: params.target.z,
      }

    }else if( params.type == 'scale' ){

      initial = {
        x: params.object.scale.x,    
        y: params.object.scale.y,
        z: params.object.scale.z
      }

      target = {
        x: params.target.x,
        y: params.target.y,
        z: params.target.z,
      }

    }else if( params.type == 'rotation' ){

      initial = {
        x: params.object.rotation.x,    
        y: params.object.rotation.y,
        z: params.object.rotation.z
      }

      target = {
        x: params.target.x,
        y: params.target.y,
        z: params.target.z,
      }

    }

    var tween = new TWEEN.Tween( initial ).to( target , params.time * 1000 );
    tween.easing( params.easing );


    // Need to assign these for the update loop
    tween.params    = params;
    tween.object    = params.object;
    tween.type      = params.type;
    tween.tweener   = this;
    tween.initial   = initial;
    tween.target    = target;
    tween.callback  = params.callback;

    tween.onUpdate(function( ){

      if( this.type == 'position' ){
        this.object.position.x = this.initial.x;
        this.object.position.y = this.initial.y;
        this.object.position.z = this.initial.z;
      }else if( this.type == 'scale' ){
        this.object.scale.x = this.initial.x;
        this.object.scale.y = this.initial.y;
        this.object.scale.z = this.initial.z;
      }else if( this.type == 'rotation' ){
        this.object.rotation.x = this.initial.x;
        this.object.rotation.y = this.initial.y;
        this.object.rotation.z = this.initial.z;
      }
    
      // Need to look for a dif so that if it is off by a small
      // amount, we still have a event called
      var dif = Math.abs( this.initial.x - this.target.x ); 
      if(  dif < .000001 ){

        var i = this.tweener.tweens.indexOf( this );
        this.tweener.tweens.splice( i , 1 );

        this.callback();
      
      }

    }.bind(tween));


    return tween


  }

  
  module.exports = Tweener;

});


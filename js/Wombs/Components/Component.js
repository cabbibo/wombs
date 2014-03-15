/*
 
   Recursive Component Design:
   Each component has arrays of objects, that will be called on 
   certain events. any componet


   each c should start with - 

   function Duplicator( BLAH )
   duplicator.prototype = new Component();

*/


define(function(require, exports, module) {

  function Component( parent ){

    this.active = false;

    this.startArray   = [];
    this.endArray     = [];
    this.updateArray  = [];

  }

  /*
    
     START
     
  */
  Component.prototype._start = function(){
    
    this.active = true;
    
    for( var i = this.startArray.length; i++ ){
      this.startArray[i]();
    }
    
    Component.prototype.start();
  
  }

  Component.prototype.start = function(){};

  Component.prototype.addToStartArray = function( f ){
    this.startArray.push( f );
  }

  
  Component.prototype._update = function(){
    
    if( this.active ){
    
      for( var i = this.updateArray.length; i++ ){
        this.updateArray[i]();
      }
      
      Component.prototype.update();
    
    }
  
  }

  Component.prototype.update = function(){};

  Component.prototype.addToUpdateArray = function( f ){
    this.updateArray.push( f );
  }



  
  Component.prototype._end = function(){
    
    this.active = false;
    
    for( var i = this.endArray.length; i++ ){
      this.endArray[i]();
    }
    
    Component.prototype.end();
  
  }

  Component.prototype.end = function(){};

  Component.prototype.addToEndArray = function( f ){
    
    this.endArray.push( f );
  
  }

  module.exports = Component;

});

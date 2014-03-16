/*
 
   Recursive Component Design:
   Each component has arrays of objects, that will be called on 
   certain events. any componet


   each c should start with - 

   function Duplicator( BLAH )
   duplicator.prototype = new Component();

*/


define(function(require, exports, module) {

  function Component(){

    this.active = false;

    this.startArray   = [];
    this.endArray     = [];
    this.updateArray  = [];

    this.components   = [];

  }

 /* Component.prototype.manifest = function( parent ){

    this.parent = parent;

    this.parent.addTo

  }*/
 
  Component.prototype.addComponent = function( component ){

    /*this.addToStartArray( component._start.bind( component ) );
    this.addToEndArray( component._end.bind( component ) );
    this.addToUpdateArray( component._update.bind( component ) );*/
    component.parent = this;
    component.siblings = this.siblings;

    this.components.push( component );

  }

  Component.prototype.removeComponent = function( component ){

    for( var i = 0; i < this.components.length; i++ ){

      if( this.components[i] === component ){

        this.components.splice( i , 1 );
        i --;

      }


    }

  }


  /*
    
     START
     
  */
  Component.prototype._start = function(){
    
    this.active = true;
    
    for( var i = 0;  i < this.components.length; i++ ){
      this.components[i]._start();
    }
    
    this.start();
  
  }

  Component.prototype.start = function(){};

  
  
  Component.prototype._update = function(){
    
    if( this.active ){
    
      for(var i = 0;  i < this.components.length; i++ ){
        this.components[i]._update();
      }
      
      this.update();
    
    }
  
  }

  Component.prototype.update = function(){};
  
  Component.prototype._end = function(){
    
    this.active = false;
    
    for( var i = 0;  i < this.endArray.length; i++ ){
      this.endArray[i]();
    }
    
    this.end();
  
  }

  Component.prototype.end = function(){};

  module.exports = Component;

});

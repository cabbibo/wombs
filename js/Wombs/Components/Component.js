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

  }

 /* Component.prototype.manifest = function( parent ){

    this.parent = parent;

    this.parent.addTo

  }*/

  Component.prototype._init = function(){

    this.active = false;

    this.startArray   = [];
    this.endArray     = [];
    this.updateArray  = [];

    this.components   = [];

  }

  Component.prototype.init = function(){}

  Component.prototype.onAdd = function(){}
 
  Component.prototype.addComponent = function( component ){

    component.parent = this;
    component.siblings = this.components;

    console.log( component );
    component.onAdd();

    console.log( component );
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

  Component.prototype.createUUID = function(){


    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    };

    function guid() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    }

    this.uuid = guid();

  }



  module.exports = Component;

});

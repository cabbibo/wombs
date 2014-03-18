/*
 
   Recursive Component Design:
   Each component has arrays of objects, that will be called on 
   certain events. any componet


   each c should start with - 

   function Duplicator( BLAH )
   duplicator.prototype = new Component();

*/


define(function(require, exports, module) {

  var Component = require('Components/Component' );
  
  function SceneComponent(){

  }

  SceneComponent.prototype = new Component();

  SceneComponent.prototype.addToBody = function( what ){

    this.body.add( what );


  }

  SceneComponent.prototype.removeFromBody = function( what ){

    this.body.remove( what );

  }

  SceneComponent.prototype.translate = function(x,y,z){

      this.position.add( new THREE.Vector3( x , y , z ) );

  }

  module.exports = SceneComponent;

});

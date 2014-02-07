define(function(require, exports, module) {

  require( 'lib/three.min' );


  function onHoverOver(){

    this.hovered = true;
    this.clickableParams.onHoverOver();

  }

  function onHoverOut(){

    this.hovered = false;
    this.clickableParams.onHoverOut();

  }

  function onClick(){

    if( this.hovered == true ){
      this.clickableParams.onClick();
    }

  }

  function Clickable( mesh , womb ,  parameters ){

    params = _.defaults( parameters || {} , {

      onClick:      function(){ console.log( 'clicked'      ) },
      onHoverOver:  function(){ console.log( 'hovered over' ) },
      onHoverOut:   function(){ console.log( 'hovered out'  ) },

    });

    mesh.clickableParams = params;

    mesh._onHoverOver = onHoverOver.bind( mesh );
    mesh._onHoverOut  = onHoverOut.bind(  mesh );
    mesh._onClick     = onClick.bind(     mesh );

    womb.addToMouseClickEvents( mesh._onClick ); 
    womb.raycaster.addCheckedMesh( mesh );
 
    return mesh;

  }

  
  module.exports = Clickable;


});

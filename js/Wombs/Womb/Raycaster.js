define(function(require, exports, module) {

  require( 'lib/three.min' );

  function Raycaster( womb , params ){
  
    this.womb             = womb;
    this.camera           = this.womb.camera;

    this.rayPosition      = new THREE.Vector3();

    this.projector        = new THREE.Projector();
	this.raycaster        = new THREE.Raycaster();

    this.intersections    = [];
    this.oIntersections   = [];

    this.intersectedMesh;

    // Pushing to this list will make 
    this.meshHoveredOverEvents  = [];
    this.meshHoveredOutEvents   = [];
    this.meshSwitchedEvents     = [];

    this.checkedMeshes          = [];

    var c = this.womb.container;

    c.addEventListener( 'mousemove', this.onMouseMove.bind( this ));
    
  }

  Raycaster.prototype.onMouseMove = function( e ){

    this.rayPosition.x =  ( e.clientX / window.innerWidth  ) * 2 - 1;
    this.rayPosition.y = -( e.clientY / window.innerHeight ) * 2 + 1;
    this.rayPosition.z = 1;

  }

  Raycaster.prototype.getIntersections = function(){


    this.vector = this.rayPosition.clone();

    this.projector.unprojectVector( this.vector , this.camera );

    this.dir = this.vector.sub( this.camera.position ).normalize();

    this.r = this.raycaster;
    this.r.set( this.camera.position , this.dir );

    this.oIntersections = this.intersections;
    this.intersections  = this.r.intersectObjects( this.womb.scene.children , true );

    // Gets rid of any meshes that we are ignoring
    var length = this.intersections.length;
    for( var i = 0 ; i < this.intersections.length; i++ ){

      if( this.intersections[i].object.ignoreRaycast ){
        this.intersections.splice( i , 1 );
        i --;
        length = this.intersections.length;
      }

    }


    if( this.intersections.length !== this.oIntersections.length ){

      if( this.intersections.length > 0 ){

        if( this.primary ){

          if( this.primary != this.intersections[0].object ){
           
            this._onMeshSwitched( this.intersections[0].object , this.primary );
          
          }

        }else{

          this._onMeshHoveredOver( this.intersections[0].object );

       
        }
       
      }else{

        this._onMeshHoveredOut();

      }

    }else{
      //console.log('all the same' );
    }

  }

  // This will be called when we intersect a new primary object
  Raycaster.prototype.onNewPrimary = function(){

  }

  Raycaster.prototype.addCheckedMesh = function( mesh ){

    this.checkedMeshes.push( mesh );

  }

  Raycaster.prototype._onMeshHoveredOver = function( object ){

    // Hovering over a mesh
    this.onMeshHoveredOver( object );
    this.oPrimary = this.primary;
    this.primary  = object;
     
    for( var i = 0; i < this.meshHoveredOverEvents.length ; i++ ){

      this.meshHoveredOverEvents[i]( object );

    }

    for( var i = 0; i < this.checkedMeshes.length; i++ ){

      if( object == this.checkedMeshes[i] ){

        this.checkedMeshes[i]._onHoverOver();

      }

    }

  }

  Raycaster.prototype.onMeshHoveredOver = function( object ){}

  Raycaster.prototype.addToMeshHoveredOverEvents = function( callback ){

    this.meshHoveredOverEvents.push( callback );

  }

  Raycaster.prototype._onMeshHoveredOut = function(){

    this.onMeshHoveredOut( this.primary );

    for( var i = 0; i < this.meshHoveredOutEvents.length ; i++ ){

      this.meshHoveredOutEvents[i]( this.primary );

    }

    for( var i = 0; i < this.checkedMeshes.length; i++ ){

      if( this.primary == this.checkedMeshes[i] ){

        this.checkedMeshes[i]._onHoverOut();

      }

    }



    this.oPrimary = this.primary;
    this.primary  = undefined;



  }

  Raycaster.prototype.onMeshHoveredOut = function( whichObject ){

  }

  Raycaster.prototype.addToMeshHoveredOutEvents = function( callback ){

    this.meshHoveredOutEvents.push( callback );

  }

  Raycaster.prototype._onMeshSwitched = function( newMesh , oldMesh ){

    // Moving from one mesh to another
    this.onMeshSwitched( newMesh , oldMesh );

    // Making sure that we call the hover functions for the 
    // switched meshes
    this._onMeshHoveredOut(  this.primary );
    this._onMeshHoveredOver( newMesh );

    this.oPrimary = this.primary;
    this.primary  = newMesh;

   
    for( var i = 0; i < this.meshSwitchedEvents.length ; i++ ){

      this.meshSwitchedEvents[i]( newMesh , oldMesh );

    }

  }

  Raycaster.prototype.onMeshSwitched = function( newMesh , oldMesh ){


  }

  Raycaster.prototype.addToMeshSwitchedEvents = function( callback ){

    this.meshSwitchedEvents.push( callback );

  }



  // TODO: This will be useful for the leap, but is unnessesary right now.
  Raycaster.prototype._update = function(){

    //console.log( 'CHECKING' );
     this.getIntersections();

  }

  module.exports = Raycaster;

});

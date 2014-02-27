define(function(require, exports, module) {

  function Raycaster( womb , params ){
  
    this.womb             = womb;
    this.camera           = this.womb.camera;

    this.rayPosition      = new THREE.Vector3();

    this.projector        = new THREE.Projector();
	this.raycaster        = new THREE.Raycaster();

    this.intersections    = [];
    this.oIntersections   = [];

    this.intersectedMesh;

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

    //console.log( this.oIntersections );
    //console.log( this.intersections );

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

  Raycaster.prototype._onMeshHoveredOver = function( object ){

    // Hovering over a mesh
    this.onMeshHoveredOver( object );
    this.oPrimary = this.primary;
    this.primary  = object;

  }

  Raycaster.prototype.onMeshHoveredOver = function( whichObject ){

  }

  Raycaster.prototype._onMeshHoveredOut = function(){

    this.onMeshHoveredOut( this.primary );
    this.oPrimary = this.primary;
    this.primary  = undefined;

  }

  Raycaster.prototype.onMeshHoveredOut = function( whichObject ){

  }

  Raycaster.prototype._onMeshSwitched = function( newMesh , oldMesh ){

    // Moving from one mesh to another
    this.onMeshSwitched( newMesh , oldMesh );
    this.oPrimary = this.primary;
    this.primary  = newMesh;

  }

  Raycaster.prototype.onMeshSwitched = function( newMesh , oldMesh ){


  }



  // TODO: This will be useful for the leap, but is unnessesary right now.
  Raycaster.prototype._update = function(){

    //console.log( 'CHECKING' );
     this.getIntersections();

  }

  module.exports = Raycaster;

});

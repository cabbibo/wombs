define(function(require, exports, module) {

  function Raycaster( world , params ){
  
    this.world        = world;

    console.log( this.world );
    this.camera       = this.world.camera;

    this.rayPosition  = new THREE.Vector3();

    this.projector    = new THREE.Projector();
	this.raycaster    = new THREE.Raycaster();

    this.intersectedMesh;

    var c = this.world.container;

    console.log( c );
    c.addEventListener( 'mousemove', this.onMouseMove.bind( this ), false );
    
  }

  Raycaster.prototype.onMouseMove = function( e ){

    this.rayPosition.x =  ( e.clientX / window.innerWidth  ) * 2 - 1;
    this.rayPosition.y = -( e.clientY / window.innerHeight ) * 2 + 1;
    this.rayPosition.z = this.camera.near;

    this.getIntersections();

  }

  Raycaster.prototype.getIntersections = function(){

    var vector = this.rayPosition.clone();

    this.projector.unprojectVector( vector , this.camera );

    var dir = vector.sub( this.camera.position ).normalize();

    var r = this.raycaster;
    r.set( this.camera.position , dir );

    this.oIntersections = this.intersections;
    this.intersections  = r.intersectObjects( this.world.scene.children , true );

    //console.log( this.oIntersections );
    //console.log( this.intersections );
    if( this.intersections.length !== this.oIntersections.length ){

      if( this.intersections.length > 0 ){

        if( this.primary ){

          if( this.primary != this.intersects[0].object ){
            
            // Moving from one mesh to another
            console.log( 'New mesh intersected' );
            this.oPrimary = this.primary 
            this.primary  = this.intersects[0].object;
          
          }

        }else{

          // Hovering over a mesh
          console.log( 'Mesh Hovered Over' );
          this.oPrimary = this.primary;
          this.primary  = undefined;

        }
       
      }else{

        // Hovering off of all meshes
        console.log( 'Mesh Hovered Out' );
        this.oPrimary = this.primary;
        this.primary  = undefined;

      }

    }else{
      //console.log('all the same' );
    }

  }

  // This will be called when we intersect a new primary object
  Raycaster.prototype.onNewPrimary = function(){

  }

  Raycaster.prototype._update = function(){

  }

  return Raycaster

});

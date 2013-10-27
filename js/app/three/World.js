define(function(require, exports, module) {
    
  var CameraController  = require( 'app/three/CameraController' );
  var Raycaster         = require( 'app/three/Raycaster'        );
  var TextCreator       = require( 'app/three/TextCreator'      );
  var SceneCreator      = require( 'app/three/SceneCreator'     );

    function World( womb , params ){

      this.params = _.defaults( params || {}, {
        
        size:       100,
        FOV:        40,
        height:     window.innerHeight,
        width:      window.innerWidth,
        background: 'rgb( 0 ,  0 ,  0 )'
      
      });

      this.womb = womb;

      this.size     = this.params.size;
      this.scene    = new THREE.Scene();
     
      // Aspect Ratio
      var aR        = this.params.width / this.params.height;
      var near      = this.params.size / 100;
      var far       = this.params.size * 4;

      this.camera = new THREE.PerspectiveCamera( this.params.FOV , aR , near , far );
      this.camera.position.z = this.params.size;

      // Gives Us Something to start with 
      if( this.params.test ){
      
        var testGeo   = new THREE.SphereGeometry( this.params.size / 10 , 10 ,10 );
        var testMat   = new THREE.MeshNormalMaterial();
        var testMesh  = new THREE.Mesh( testGeo , testMat );

        this.scene.add( testMesh );

        this.testMesh = testMesh;


        for( var i = 0; i < 20; i++ ){
    
          var mesh = new THREE.Mesh( testGeo , testMat );

          mesh.position.x = (Math.random() - .5) * this.params.size;
          mesh.position.y = (Math.random() - .5) * this.params.size;
          mesh.position.z = (Math.random() - .5) * this.params.size;

          mesh.scale.multiplyScalar( .1 );

          this.testMesh.add( mesh );


        }

      }

      // Getting the container in the right location
      this.container = document.createElement( 'div' );
      this.container.style.width      = '100%';
      this.container.style.height     = '100%';
      this.container.style.position   = 'absolute';
      this.container.style.top        = '0px';
      this.container.style.left       = '0px';
      this.container.style.background = this.params.background;

      document.body.appendChild( this.container );

      this.renderer = new THREE.WebGLRenderer();

      this.renderer.setSize( window.innerWidth, window.innerHeight );
      this.container.appendChild( this.renderer.domElement );


      this.cameraController = new CameraController(   this );
      this.raycaster        = new Raycaster(          this );
      this.textCreator      = new TextCreator(        this );
      this.sceneCreator     = new SceneCreator(       this );

      window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );





    }
 
    World.prototype._update = function(){
     
      this.raycaster._update();
      this.cameraController._update();
      this.update();

    }


    World.prototype.update = function(){
    
    }

    World.prototype.render = function(){

      this.renderer.render( this.scene , this.camera );

    }


    World.prototype.onWindowResize = function(){

      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize( window.innerWidth, window.innerHeight );

    }

    World.prototype.console = function(){ console.log( this ); }

    //Return the module value
    return World 

});

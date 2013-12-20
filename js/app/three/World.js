define(function(require, exports, module) {
    
  var CameraController  = require( 'app/three/CameraController' );
  var Raycaster         = require( 'app/three/Raycaster'        );
  var TextCreator       = require( 'app/three/TextCreator'      );
  var SceneController   = require( 'app/three/SceneController'  );
  var ObjLoader         = require( 'app/three/ObjLoader'        );
  var EffectComposer    = require( 'app/three/EffectComposer'   );
  var UserMediaTexture  = require( 'app/three/UserMediaTexture' );

  function World( womb , params ){


      this.womb     = womb;

      this.params = _.defaults( params || {}, {
        
        size:       100,
        FOV:        40,
        height:     window.innerHeight,
        width:      window.innerWidth,
        background: 'rgb( 0 ,  0 ,  0 )',
        hex:        0x000000
      
      });


      this.size     = this.params.size;
      this.scene    = new THREE.Scene();

          
      // Aspect Ratio
      var aR        = this.params.width / this.params.height;
      var near      = this.size / 100;
      var far       = this.size * 4;

      this.camera = new THREE.PerspectiveCamera( this.params.FOV , aR , near , far );
      this.camera.position.z = this.params.size;

      this.scene.fog = new THREE.Fog( this.params.hex , this.size , far );

      // Gives Us Something to start with 
      if( this.params.test ){
      
        var testGeo   = new THREE.SphereGeometry( this.params.size / 10 , 10 ,10 );
        var testMat   = new THREE.MeshNormalMaterial();
        var testMesh  = new THREE.Mesh( testGeo , testMat );

        this.scene.add( testMesh );

        this.testMesh = testMesh;


        for( var i = 0; i < 20; i++ ){
    
          var mesh = new THREE.Mesh( testGeo , testMat )
          mesh.position.x = (Math.random() - .5) * this.params.size;
          mesh.position.y = (Math.random() - .5) * this.params.size;
          mesh.position.z = (Math.random() - .5) * this.params.size;

          mesh.scale.multiplyScalar( .1 );

          this.testMesh.add( mesh );


        }

      }

      // Getting the container in the right location
      this.container = document.createElement( 'div' );
      this.container.id = 'renderingContainer';

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




      if( this.womb.params.cameraController )
        this.cameraController = new CameraController( this , this.womb.params.cameraController );
      
      if( this.womb.params.raycaster )
        this.raycaster        = new Raycaster(        this );

      if( this.womb.params.objLoader )
        this.objLoader        = new ObjLoader(        this );

      if( this.womb.params.effectComposer )
        this.effectComposer   = new EffectComposer(   this );

      if( this.womb.params.userMediaTexture ){
        this.userMediaTexture = new UserMediaTexture( this );

      if( this.womb.params.textCreator ){
        this.textCreator = new TextCreator(      this );
      
      
      this.sceneController  = new SceneController(    this );

      window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );


    }
 
    World.prototype._update = function(){
     
      this.sceneController._update();
      
      if( this.raycaster )
        this.raycaster._update();
      
      if( this.cameraController )
        this.cameraController._update( this.womb.delta );

      if( this.userMediaTexture )
        this.userMediaTexture._update();


      this.update();

    }


    World.prototype.update = function(){
    
    }

    World.prototype.render = function(){

      if( this.effectComposer )
        this.effectComposer.render();
      else
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


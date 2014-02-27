define(function(require, exports, module) {

  /*       YOU        */  require( 'lib/three'                      );
  /*       ARE        */  require( 'lib/underscore'                 );
  /*      WOMBS       */  require( 'lib/stats.min'                  );
 

  var Creator           = require( 'Womb/Creator'                   );

  var Interface         = require( 'Womb/Interface'                 );
  
  var Animator          = require( 'Womb/Animator'                  );
  var Tweener           = require( 'Womb/Tweener'                   );
  
  var Raycaster         = require( 'Womb/Raycaster'                 );
  var EffectComposer    = require( 'Womb/EffectComposer'            );

  var AudioController   = require( 'Womb/Audio/AudioController'     );

  var CameraController  = require( 'Womb/Camera/CameraController'   );

  var UserMediaTexture  = require( 'Womb/Textures/UserMediaTexture' );
  var TextCreator       = require( 'Womb/Textures/TextTexture'      );
  
  var Loader            = require( 'Womb/Loading/Loader'            );

  var ImageLoader       = require( 'Womb/Loading/ImageLoader'       );
  var ModelLoader       = require( 'Womb/Loading/ModelLoader'       );
  var ObjLoader         = require( 'Womb/Loading/OBJLoader'         );
  var JSONLoader        = require( 'Womb/Loading/JSONLoader'        );

  
  var LeapController    = require( 'Utils/LeapController'           );
  var Defaults          = require( 'Utils/Defaults'                 );


  function Womb(params){

    this.params = _.defaults( params || {} , {
      raycaster:        false,
      cameraController: 'TrackballControls',
      massController:   false,
      springController: false,
      leapController:   false,
      textCreator:      false,
      size:             100,
      color:            '#000000',
      neededTech:       [ 'webGL' , 'audio' , 'mobile' ],
      failureTitleText: "This project requires the following:",
      failureVideoText: "But here's a video which is probably better anyway",
      failureVideo:     69517912,  // The Vimeo Video Number !

  
      defaults:{
        textureFile: '/lib/img/textures/ash_uvgrid01.jpg' ,
        geometry: new THREE.IcosahedronGeometry( 10 , 4 ),
        material: new THREE.MeshNormalMaterial()
      }


    });

    this.loaderParams = {};
    this.loaderParams.neededTech = this.params.neededTech;

    this.interface        = new Interface(        this );
    this.loader           = new Loader(           this );
    this.tweener          = new Tweener(          this );

    this.animator         = new Animator(         this );
    this.audioController  = new AudioController(  this );

    this.leapController = LeapController;
    this.leapController.size = this.size;


    // Time uniform
    this.time = { type: "f", value: 0.0 } ;
    
    /*
     *
     * SETTING UP THE SCENE
     *
     */


    this.size = this.params.size;

    this.scene = new THREE.Scene();
    this.body  = this.scene;


    // CAMERA
    this.width = window.innerWidth;
    this.height = window.innerHeight;
 
    this.camera = new THREE.PerspectiveCamera( 
      40 ,
      this.width / this.height ,
      this.size / 100,
      this.size  * 40
    );

    this.camera.position.z = this.size;

    this.mouse = new THREE.Vector2();

    var c = this.params.color.replace( "#" , "0x" );
    this.color = new THREE.Color( );
    this.color.setHex( c );
   
    this.scene.fog = new THREE.Fog( this.color , this.size , this.camera.far * .8 );

    // Getting the container in the right location
    this.container = document.createElement( 'div' );
    this.container.id = 'renderingContainer';

    document.body.appendChild( this.container );

    this.renderer = new THREE.WebGLRenderer();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

 
    this.renderer.domElement.style.background = this.params.color;
    this.container.appendChild( this.renderer.domElement );

    window.addEventListener( 'resize', this.onWindowResize.bind( this ), false );

    var c = this.container;
    c.addEventListener( 'mousemove' , this._onMouseMove.bind(  this ), false );
    c.addEventListener( 'mousedown' , this._onMouseDown.bind(  this ), false );
    c.addEventListener( 'mouseup'   , this._onMouseUp.bind(    this ), false );
    c.addEventListener( 'click'     , this._onMouseClick.bind( this ), false );

    this.mouseUpEvents      = [];
    this.mouseDownEvents    = [];
    this.mouseClickEvents   = [];

    this.updateArray        = []; // Functions to be called every update

    this.clock            = new THREE.Clock();

    this.cameraController = new CameraController( this , this.params.cameraController );
    this.raycaster        = new Raycaster( this );
    this.imageLoader      = new ImageLoader( this );
    this.modelLoader      = new ModelLoader( this );
    this.textCreator      = new TextCreator( this );


    this.creator  = new Creator( this );

    // Making sure that we have some defaults to pass through the program,
    // so we don't have to use as much memory creating a bunch of new materials etc
    this.defaults = new Defaults( this.params.defaults );
    this.defaults.texture = this.imageLoader.load( this.defaults.textureFile );


    // Making sure a bunch of stuff gets updated 
    this.addToUpdateArray( this.raycaster._update.bind( this.raycaster ) );
    this.addToUpdateArray( this.audioController._update.bind( this.audioController )  );
    this.addToUpdateArray( this.creator._update.bind( this.creator ) );
   

    // Giving us a global WOMB variable!
    window.womb = this;

  }

  // This is what will be called in our loaded
  Womb.prototype._start = function(){
   
    if( this.leapController ){
      this.leapController.connect();
    }
    
    this.start();

    this.animator.start();

  }

   Womb.prototype.start = function(){

  }


  Womb.prototype._onMouseMove = function( e ){
  
    this.mouse.x = 1 - ( this.width  - e.clientX ) / this.width;
    this.mouse.y = 1 - ( this.height - e.clientY ) / this.height;
 
    this.onMouseMove(e);

  }
  Womb.prototype.onMouseMove = function(e){};



  Womb.prototype._onMouseClick = function(e){
  
    this.onMouseDown(e);

    for( var i = 0; i < this.mouseClickEvents.length; i++ ){
      this.mouseClickEvents[i]();
    }


  }
  Womb.prototype.onMouseClick = function(e){};

  Womb.prototype.addToMouseClickEvents = function( callback ){
    this.mouseClickEvents.push( callback );
  }



  Womb.prototype._onMouseDown = function(e){
  
    this.onMouseDown(e);

    for( var i = 0; i < this.mouseDownEvents.length; i++ ){
      this.mouseDownEvents[i]();
    }

    this.mouseDown = true;

  }
  Womb.prototype.onMouseDown = function(e){};

  Womb.prototype.addToMouseDownEvents = function( callback ){
    this.mouseDownEvents.push( callback );
  }


  Womb.prototype._onMouseUp = function(e){
  
    this.onMouseUp(e);

    for( var i = 0; i < this.mouseUpEvents.length; i++ ){
      this.mouseUpEvents[i]();
    }

    this.mouseDown = false;

  }
  Womb.prototype.onMouseUp = function(e){};

  Womb.prototype.addToMouseUpEvents = function( callback ){
    this.mouseUpEvents.push( callback );
  }




  Womb.prototype.console = function(){ 
    console.log( this ); 
  }

  Womb.prototype._update = function(){

    this.delta = this.clock.getDelta();

    //console.log( this.delta );
    //console.log( this.time );
    this.time.value += this.delta;

    TWEEN.update();

    //this.massController._update();
    //this.springController._update();
   
    /*this.audioController._update();
     
    this.creator._update();
    
    this.raycaster._update();*/
    
    this.cameraController._update( this.delta );


    for( var i = 0; i < this.updateArray.length; i++ ){

      var f = this.updateArray[i];
      f();

    }

    this.update();

    this.render();


  }

  Womb.prototype.addToUpdateArray = function( callback ){

    this.updateArray.push( callback )

  }

  Womb.prototype.render = function(){

    if( this.effectComposer )
      this.effectComposer.render();
    else
      this.renderer.render( this.scene , this.camera );

  }

  Womb.prototype.onWindowResize = function(){

    this.width  = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

  }



  Womb.prototype.update = function(){

  }

  module.exports = Womb;

});

/**
 * @author cabbibo / http://cabbibo.com
 *
 * Circle to create a new anchor! 
 * Will need to pass in a Scene, as well as a leap controller
 * In order to create the camera, so that you can place the 
 * UI elements
 *
 *
 */

THREE.LeapSpringControls = function ( object , controller , scene , params , domElement ) {

  this.object     = object;
  this.controller = controller;
  this.scene      = scene;
  this.domElement = ( domElement !== undefined ) ? domElement : document;

  // API
  
  this.enable = true;

  this.velocity = new THREE.Vector3();
  this.acceleration = new THREE.Vector3();

  this.dampening = ( object.dampening !== undefined ) ? object.dampening : .95;

  this.weakDampening    = .99;
  this.strongDampening  = .9;

  this.dampening        = this.strongDampening;

  this.size             = 120;
  this.springConstant   = 1;
  this.staticLength     = this.size ;
  this.mass             = 50;

  this.target = new THREE.Object3D();
  this.anchor = new THREE.Object3D();

  // Just For Show:
  this.anchorIndicator = new THREE.Mesh( new THREE.IcosahedronGeometry( this.size/10 , 1 ), new THREE.MeshNormalMaterial() );
  this.anchor.add( this.anchorIndicator );

  this.scene.add( this.anchor );

  this.getForce = function(){

    var difference = new THREE.Vector3();
    difference.subVectors( this.object.position , this.anchor.position );

    var x = difference.length() - this.staticLength;

    // Hooke's Law
    var f = difference.normalize().multiplyScalar(x).multiplyScalar( this.springConstant );

    return f;

  }

  this.applyForce = function( f ){

    this.acceleration = f.multiplyScalar( 1 / this.mass );

    this.velocity.add( this.acceleration );

    this.velocity.multiplyScalar( this.dampening );

    this.object.position.sub( this.velocity );

  }

  this.update = function(){


    var a = this.anchor.position;
    var t = this.target.position;
    
    a.x   = a.x - ( a.x - t.x )/12;
    a.y   = a.y - ( a.y - t.y )/12;
    a.z   = a.z - ( a.z - t.z )/12;
    
    f     = this.getForce();

    this.applyForce( f );


    this.object.lookAt( this.anchor.position );

    this.frame = this.controller.frame();
    if( !this.oFrame ) this.oFrame = this.frame;
  
    if( this.frame ){

      if( this.frame.hands[0] && this.frame.pointables.length == 1 ){

        if( this.frame.gestures[0] && !this.oFrame.gestures[0] ){
          if( this.frame.gestures[0].type == 'circle' ){

            var center = this.frame.gestures[0].center;
            var position = this.controller.leapToScene( this.frame , center ); 

            this.target.position = position;

            console.log('helllso');


          }

        }

      }

    }

    this.oFrame = this.frame;


  }

}

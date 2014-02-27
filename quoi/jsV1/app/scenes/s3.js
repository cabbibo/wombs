
define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  /*
  
     Mandala Scene 1

  */

  var s3 = {}

  s3.init = function( womb ){
  womb.s3 = womb.world.sceneController.createScene({
    transition:'scale' 
  });

  womb.s3.light = new THREE.DirectionalLight( 0xeeeeee , .5 );
  womb.s3.light.position.set( 0 , 0 , 1 );
  womb.s3.scene.add( womb.s3.light );



  womb.s3.geo = new THREE.SphereGeometry( womb.world.size/20 , 10 , 10 );
  womb.s3.material = new THREE.MeshPhongMaterial({
      color:        0xaa9933,
      emissive:     0xaa3399,
      specular:     0xeeaa99,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  

  womb.s3.material1 = new THREE.MeshPhongMaterial({
      color:        0xaaaa33,
      emissive:     0xaa0044,
      specular:     0xeeee99,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  


  // hand Mandala 1
  womb.s3.hM1 = new THREE.Object3D();
  womb.s3.hM2 = new THREE.Object3D();
  womb.s3.audioGeometries = [];  

  var geo = new AudioGeometry( womb.s3.geo , womb.stream , {
    analyzingFunction: AnalyzingFunctions.vertexDependent( 5000 )
  });
  womb.s3.audioGeometries.push( geo );

  for( var i = 0; i < 10; i++ ){


    var mesh  = new THREE.Mesh( geo.geometry , womb.s3.material1 );
    var mesh1 = new THREE.Mesh( geo.geometry , womb.s3.material1 );
    
    mesh.rotation.z = 2 * Math.PI * i / 10;
    mesh1.rotation.z = 2 * Math.PI * i / 10;

    womb.s3.hM1.add( mesh  );
    womb.s3.hM2.add( mesh1 );


  }

  womb.s3.M1 = womb.massController.createMass( womb.s3.scene , womb.s3.hM1 ,{
    mass: 1000000000000000,  
  });

  womb.s3.M2 = womb.massController.createMass( womb.s3.scene , womb.s3.hM2 ,{
    mass: 100000000000000,  
  });

  womb.s3.M1.position.x  =   womb.world.size / 5;
  womb.s3.M2.position.x  = - womb.world.size / 5;

  womb.s3.M1.updatePosition();
  womb.s3.M2.updatePosition();

  womb.s3.handMasses = [];
  womb.s3.handMasses.push( womb.s3.M1 );
  womb.s3.handMasses.push( womb.s3.M2 );


  womb.s3.audioMasses = [];

  
   
  var amount = 20
  for( var i = 0; i < amount; i ++ ){

    var obj = new THREE.Mesh( 
      womb.s3.audioGeometries[0].geometry, 
      womb.s3.material
    );
    obj.rotation.z = 4 * Math.PI * i / amount;

      var mass = womb.massController.createMass( womb.s3.scene , obj );
      mass.randomPosition( womb.world.size );

      womb.s3.audioMasses.push( mass );

      if( i == 0 ){
        womb.springController.createSpring( 
          womb.s3.audioMasses[i],
          womb.s3.handMasses[0],
          3,
          1
        );
      }else if( i == amount / 2 ){
        womb.springController.createSpring( 
          womb.s3.audioMasses[i],
          womb.s3.handMasses[1],
          3,
          1

        );
      }else{
        womb.springController.createSpring( 
          womb.s3.audioMasses[i],
          womb.s3.audioMasses[i-1],
          3,
          1

        );
      }


    }

  



  womb.s3.update = function(){

    this.f = LeapController.frame();
    if( !this.oF ) this.oF = this.f;
 

    for( var i =0 ; i < 2; i ++ ){

      if( this.f.hands[i] ){

        var h = this.f.hands[i];
        var hM = this.handMasses[i];
        hM.position = LeapController.leapToScene( this.f , h.palmPosition );
        hM.updatePosition();

      }else{

      }
    
    }
   
    for( var i = 0; i < this.audioGeometries.length; i++ ){
      this.audioGeometries[i].update();
    }

    this.oF = this.f;

  }

}

 module.exports = s3;

});



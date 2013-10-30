
define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  /*
  
     Mandala Scene 1

  */

  var s2 = {}

  s2.init = function( womb ){
  womb.s2 = womb.world.sceneController.createScene({
    transition:'scale' 
  });

  womb.s2.light = new THREE.DirectionalLight( 0xeeeeee , .5 );
  womb.s2.light.position.set( 0 , 1 , 0 );
  womb.s2.scene.add( womb.s2.light );



  womb.s2.geo = new THREE.SphereGeometry( womb.world.size/20 , 10 , 10 );
  womb.s2.material = new THREE.MeshPhongMaterial({
      color:        0x440077,
      emissive:     0x008877,
      specular:     0x440077,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  

  womb.s2.material1 = new THREE.MeshPhongMaterial({
      color:        0x007744,
      emissive:     0xaa8877,
      specular:     0x44aa99,
      shininess:    100000,
      ambient:      0x1100ff,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  

  // hand Mandala 1
  womb.s2.hM1 = new THREE.Object3D();
  womb.s2.hM2 = new THREE.Object3D();
  womb.s2.audioGeometries = [];  

  var geo = new AudioGeometry( womb.s2.geo , womb.stream , {
    analyzingFunction: AnalyzingFunctions.vertexDependent( 5000 )
  });
  womb.s2.audioGeometries.push( geo );

  for( var i = 0; i < 10; i++ ){


    var mesh  = new THREE.Mesh( geo.geometry , womb.s2.material1 );
    var mesh1 = new THREE.Mesh( geo.geometry , womb.s2.material1 );
    
    mesh.rotation.z = 2 * Math.PI * i / 10;
    mesh1.rotation.z = 2 * Math.PI * i / 10;

    womb.s2.hM1.add( mesh  );
    womb.s2.hM2.add( mesh1 );


  }

  womb.s2.M1 = womb.massController.createMass( womb.s2.scene , womb.s2.hM1 ,{
    mass: 100,  
  });

  womb.s2.M2 = womb.massController.createMass( womb.s2.scene , womb.s2.hM2 ,{
    mass: 100,
  });

  womb.s2.M1.position.x  =   womb.world.size / 5;
  womb.s2.M2.position.x  = - womb.world.size / 5;

  womb.s2.M1.updatePosition();
  womb.s2.M2.updatePosition();

  womb.s2.handMasses = [];
  womb.s2.handMasses.push( womb.s2.M1 );
  womb.s2.handMasses.push( womb.s2.M2 );


  womb.s2.audioMasses = [];

  
   
  var amount = 20
  for( var i = 0; i < amount; i ++ ){

    var obj = new THREE.Mesh( 
      womb.s2.audioGeometries[0].geometry, 
      womb.s2.material
    );
    obj.rotation.z = 4 * Math.PI * i / amount;

      var mass = womb.massController.createMass( womb.s2.scene , obj );
      mass.randomPosition( womb.world.size );

      womb.s2.audioMasses.push( mass );

      if( i == 0 ){
        womb.springController.createSpring( 
          womb.s2.audioMasses[i],
          womb.s2.handMasses[0],
          1,
          1
        );
      }else if( i == amount / 2 ){
        womb.springController.createSpring( 
          womb.s2.audioMasses[i],
          womb.s2.handMasses[1],
          1,
          1

        );
      }else{
        womb.springController.createSpring( 
          womb.s2.audioMasses[i],
          womb.s2.audioMasses[i-1],
          3,
          1

        );

        if( i == amount-1 ){

          womb.springController.createSpring( 
            womb.s2.audioMasses[i],
            womb.s2.audioMasses[(amount/2)-1],
            3,
            1
          );

        }

      }




    }

  



  womb.s2.update = function(){

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

 module.exports = s2;

});



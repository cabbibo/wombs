
define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  /*
  
     Mandala Scene 1

  */

  var s1 = {}

  s1.init = function( womb ){
  womb.s1 = womb.world.sceneController.createScene({
    transition:'scale' 
  });

  womb.s1.light = new THREE.DirectionalLight( 0xeeeeee , .5 );
  womb.s1.light.position.set( 0 , 1 , 0 );
  womb.s1.scene.add( womb.s1.light );



  womb.s1.geo = new THREE.SphereGeometry( womb.world.size/20 , 10 , 10 );
  womb.s1.material = new THREE.MeshPhongMaterial({
      color:        0x440077,
      emissive:     0x008877,
      specular:     0x440077,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  

  womb.s1.material1 = new THREE.MeshPhongMaterial({
      color:        0x007744,
      emissive:     0xaa8877,
      specular:     0x44aa99,
      shininess:    100000,
      ambient:      0x1100ff,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
  });  

  // hand Mandala 1
  womb.s1.hM1 = new THREE.Object3D();
  womb.s1.hM2 = new THREE.Object3D();
  womb.s1.audioGeometries = [];  

  var geo = new AudioGeometry( womb.s1.geo , womb.stream , {
    analyzingFunction: AnalyzingFunctions.vertexDependent( 5000 )
  });
  womb.s1.audioGeometries.push( geo );

  for( var i = 0; i < 10; i++ ){


    var mesh  = new THREE.Mesh( geo.geometry , womb.s1.material1 );
    var mesh1 = new THREE.Mesh( geo.geometry , womb.s1.material1 );
    
    mesh.rotation.z = 2 * Math.PI * i / 10;
    mesh1.rotation.z = 2 * Math.PI * i / 10;

    womb.s1.hM1.add( mesh  );
    womb.s1.hM2.add( mesh1 );


  }

  womb.s1.M1 = womb.massController.createMass( womb.s1.scene , womb.s1.hM1 ,{
    mass: 1000000000000000,  
  });

  womb.s1.M2 = womb.massController.createMass( womb.s1.scene , womb.s1.hM2 ,{
    mass: 100000000000000,  
  });

  womb.s1.M1.position.x  =   womb.world.size / 5;
  womb.s1.M2.position.x  = - womb.world.size / 5;

  womb.s1.M1.updatePosition();
  womb.s1.M2.updatePosition();

  womb.s1.handMasses = [];
  womb.s1.handMasses.push( womb.s1.M1 );
  womb.s1.handMasses.push( womb.s1.M2 );


  womb.s1.audioMasses = [];

  womb.loader.numberToLoad ++;
  womb.world.objLoader.loadFile( 'js/lib/tree.obj' , function(geo){

    womb.loader.loadBarAdd();
    var geo = new AudioGeometry( geo[0] , womb.stream ,{
      analyzingFunction: AnalyzingFunctions.straightScale( 256 ) 
    });

    womb.s1.audioGeometries.push( geo );

   
    for( var i = 0; i < 10; i ++ ){

      var obj = new THREE.Mesh( 
        geo.geometry, 
        womb.s1.material
        //womb.world.userMediaTexture.material
      );
      obj.rotation.z = 2 * Math.PI * i / 10;

      var mass = womb.massController.createMass( womb.s1.scene , obj );
      mass.randomPosition( womb.world.size );

      womb.s1.audioMasses.push( mass );
    

    }

    womb.s1.createSprings();

  
  });


  womb.s1.createSprings = function(){

    womb.springController.createSpringsToMass(
        womb.s1.handMasses[0],
        womb.s1.audioMasses  
    );

    womb.springController.createSpringsToMass(
        womb.s1.handMasses[1],
        womb.s1.audioMasses  
    ); 

  }


  womb.s1.update = function(){

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
module.exports = s1;

});



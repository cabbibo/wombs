define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');




  var cP1 = {};

  cP1.init = function( womb ){

    womb.cP1 = womb.world.sceneController.createScene({
      transition:'scale'
    });


    womb.cP1.geo = new THREE.Geometry();

    var r = womb.world.size / 10;
    var p = 0;
    for( var i = 0; i < 100; i++ ){

      var t = 2 * Math.PI * i / 100;
    
      var vert = Math.toCart( r , t , p );
      womb.cP1.geo.vertices.push( vert );

    }

    womb.cP1.audioGeometry = new AudioGeometry( womb.cP1.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.straightScale( 128 )
    });

    

    womb.cP1.material = new THREE.ParticleBasicMaterial();
    womb.cP1.material.size = 2;
    womb.cP1.material.opacity = .5;
    womb.cP1.material.transparent = true;
    womb.cP1.material.blending = THREE.AlphaBlending;
    for( var i = 0; i < 20; i ++ ){

      var pS = new THREE.ParticleSystem( womb.cP1.audioGeometry.geometry , womb.cP1.material );

      pS.rotation.x = Math.PI / 2;
      pS.scale.multiplyScalar( (i+10) / 20 );

      womb.cP1.scene.add( pS );
    }

    womb.cP1.scene.position.z = - womb.world.size;

    womb.cP1.update = function(){

      this.audioGeometry.update();

    }

  }


  module.exports = cP1;

});

define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');




  var cP1 = {};

  cP1.init = function( womb ){

    womb.cP1 = womb.world.scenController.createScene({
      tansition:'scale'
    });


    womb.cP1.geo = new THREE.Geometry();

    var r = womb.world.size / 10;
    var p = 0;
    for( var i = 0; i < 100; i++ ){

      var t = Math.PI * i / 100;
    
      var vert = Math.toCart( r , t , p );
      womb.cP1.geo.push( vert );

    }

    womb.cP1.audioGeomety = new AudioGeometry( womb.cP1.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.vertexDependent( 5000 )
    });

    womb.cP1.material = new THREE.ParticleBasicMaterial();
    for( var i = 0; i < 20; i ++ ){

      var pS = new THREE.ParticleSystem( womb.cP1.audioGeometry , womb.cP1.material );

      pS.scale.multiplyScalar( i / 20 );

      womb.cP1.scene.add( pS );
    }

    womb.cP1.update = function(){

      this.audioGeometry.update();

    }

  }

  module.exports = cP1;

});

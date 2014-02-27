define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var s6 = {};

  s6.init = function( womb ){

    womb.s6 = womb.world.sceneController.createScene({
      transition:'scale'
    });

    womb.s6.light = new THREE.DirectionalLight( 0xeeeeee , .5 );
    womb.s6.light.position.set( 0 , 1 , 0 );
    womb.s6.scene.add( womb.s6.light );

    womb.s6.geo = new THREE.Geometry();

    var geom = new THREE.Geometry(); 
    for(var i = 0; i<100; i++ ){
      var v = new THREE.Vector3(
        // womb.world.size*Math.sin(i),
        // i*Math.sin(i),
        // i*Math.cos(i)
      );
      womb.s6.geo.vertices.push(v);
      if(i!=0 && i!=1){
        womb.s6.geo.faces.push( new THREE.Face3(i-2,i-1,i) );
      }
    }
    womb.s6.geo.computeFaceNormals();

    womb.s6.material = new THREE.MeshPhongMaterial({
      color:        0xaa33aa,
      emissive:     0x00aa44,
      specular:     0xee99ee,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
    });  


    for( var i = 0; i < 10; i ++ ){

      var mesh = new THREE.Mesh( womb.s6.geo , womb.s6.material );
      mesh.rotation.z = 2 * Math.PI * i / 10;
      womb.s6.scene.add( mesh );


    }

    //womb.s6.mesh = new THREE.Mesh( womb.s6.geo , womb.s6.material );
    //womb.s6.scene.add( womb.s6.mesh );

    womb.s6.update = function(){

      var f = LeapController.frame();
      var v = womb.s6.geo.vertices;
       
      for( var i = 0; i < v.length; i++ ){

        if( !f.pointables[i/10] ){

          if( i != 0 ){
            v[i].x -= ( v[i].x - v[i-1].x ) / 15;
            v[i].y -= ( v[i].y - v[i-1].y ) / 15;
            v[i].z -= ( v[i].z - v[i-1].z ) / 15;
          }

         }else{


           p = LeapController.leapToScene( f , f.pointables[i/10].tipPosition );
           v[i].x -= ( v[i].x - p.x ) / 2;
           v[i].y -= ( v[i].y - p.y ) / 2;
           v[i].z -= ( v[i].z - p.z ) / 2;

         }


      }


       womb.s6.geo.verticesNeedUpdate = true;


    }


  }

  module.exports = s6;

});

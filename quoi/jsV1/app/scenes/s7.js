define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );


  var s7 = {};

  s7.init = function( womb ){

    womb.s7 = womb.world.sceneController.createScene({
      transition:'scale'
    });

    womb.s7.light = new THREE.DirectionalLight( 0xeeeeee , .5 );
    womb.s7.light.position.set( 1 , 1 , 1 );
    womb.s7.scene.add( womb.s7.light );

    womb.s7.geo = new THREE.Geometry();

    var geom = new THREE.Geometry(); 
    for(var i = 0; i<100; i++ ){
      var v = new THREE.Vector3(
        // womb.world.size*Math.sin(i),
        // i*Math.sin(i),
        // i*Math.cos(i)
      );
      womb.s7.geo.vertices.push(v);
      if(i!=0 && i!=1){
        womb.s7.geo.faces.push( new THREE.Face3(i-2,i-1,i) );
      }
    }
    womb.s7.geo.computeFaceNormals();

    womb.s7.material = new THREE.MeshPhongMaterial({
      color:        0x00aaaa,
      emissive:     0x0044aa,
      specular:     0x00eeee,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
    });  



    for( var i = 0; i < 10; i ++ ){

      var mesh = new THREE.Mesh( womb.s7.geo , womb.s7.material );
      mesh.rotation.z = 2 * Math.PI * i / 10;
      womb.s7.scene.add( mesh );


    }

    //womb.s7.mesh = new THREE.Mesh( womb.s7.geo , womb.s7.material );
    //womb.s7.scene.add( womb.s7.mesh );

    womb.s7.update = function(){

      var f = LeapController.frame();
      var v = womb.s7.geo.vertices;
       
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


       womb.s7.geo.verticesNeedUpdate = true;


    }


  }

  module.exports = s7;

});

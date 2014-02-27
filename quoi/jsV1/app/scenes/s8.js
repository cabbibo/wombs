define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );



  var s8 = {};


  s8.init = function( womb ){

    womb.s8 = womb.world.sceneController.createScene({
      transition:'scale',
      exitFinish: function(){

        for( var i = 0; i < this.scene.meshes.length; i++ ){

          var m = this.scene.meshes[i];
          m.material = this.scene.material.clone();
          m.material.needsUpdate = true;

        }

      }

    });

    //womb.s8.light = new THREE.DirectionalLight( 0xeeeeee , .5 );
    //womb.s8.light.position.set( 0 , 0 , 1 );
    //womb.s8.scene.add( womb.s8.light );



    womb.s8.h1 = new THREE.Object3D();
    womb.s8.h1.material = new THREE.MeshPhongMaterial({
      color:        0xaa33aa,
      emissive:     0x4400aa,
      specular:     0xee99ee,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
    });  
    womb.s8.h1.geometry = new THREE.SphereGeometry( womb.world.size / 30 );
    womb.s8.h1.mesh     = new THREE.Mesh( womb.s8.h1.geometry , womb.s8.h1.material ); 
    womb.s8.h1.mesh.position.z = -womb.world.size * 2;
    womb.s8.h1.add( womb.s8.h1.mesh );

    womb.s8.h1.light = new THREE.PointLight( 0xffff00 , 4 , womb.world.size  );
    womb.s8.h1.add( womb.s8.h1.light );

    womb.s8.scene.add( womb.s8.h1 );



    womb.s8.h2 = new THREE.Object3D();
    womb.s8.h2.material = new THREE.MeshPhongMaterial({
      color:        0x33aaaa,
      emissive:     0x44aa00,
      specular:     0x99eeee,
      shininess:    100000,
      ambient:      0x110000,
      shading:      THREE.FlatShading,
      //side:         THREE.DoubleSide,
      opacity:      1,
      transparent:  true
    });      
    womb.s8.h2.geometry = new THREE.SphereGeometry( womb.world.size / 30 );
    womb.s8.h2.mesh     = new THREE.Mesh( womb.s8.h2.geometry , womb.s8.h2.material ); 
    womb.s8.h2.mesh.position.z = -womb.world.size * 2;
    womb.s8.h2.add( womb.s8.h2.mesh );

    womb.s8.h2.light = new THREE.PointLight( 0xff00ff , 4 , womb.world.size/2  );
    womb.s8.h2.add( womb.s8.h2.light );

    womb.s8.scene.add( womb.s8.h2 );


    womb.s8.fractalScene = new THREE.Object3D();
    womb.s8.scene.add( womb.s8.fractalScene );

    womb.s8.fractalScene.position.z = -womb.world.size;


    var directions = [

      [  1 ,  0 ,  0 ],
      [  0 ,  1 ,  0 ],
      [  0 ,  0 ,  1 ],
      [ -1 ,  0 ,  0 ],
      [  0 , -1 ,  0 ],
      [  0 ,  0 , -1 ],


      ]

    
    // JavaScript Document

    var totalWidth      = womb.world.size; 
    var reductionFactor = 2;
    var complexity      = 7;
    var minWidth        = totalWidth / Math.pow( reductionFactor , complexity );

    placingMatrix       = [];
    // putting something in the zero place,
    // so that our hovercube doesn't always jump to the center
    
   // placingMatrix.push([0 , 0 , 0 , totalWidth/reductionFactor ]);

    //for( var i = 0; i < 6; i++ )
      place( 0 , 0 , 0 , totalWidth / reductionFactor , 10 );

    function place(xPos,yPos,zPos,boxWidth,oldDirection){
       
      var newWidth=boxWidth/reductionFactor;
      var oppOld
      
      // Tells us which direction we shoul
      // not place the box in
      if ( oldDirection >= 3 ){
        oppOld = oldDirection - 3;	
      }else{
        oppOld = oldDirection + 3;	
      }
      
      for( var i = 0; i < directions.length; i++ ){
          
          if( i != oppOld ){
              var thisBox={};
              thisBox.x=(directions[i][0]*(boxWidth+newWidth)*.5)+xPos;
              thisBox.y=(directions[i][1]*(boxWidth+newWidth)*.5)+yPos;
              thisBox.z=(directions[i][2]*(boxWidth+newWidth)*.5)+zPos;
              placingMatrix.push([thisBox.x,thisBox.y,thisBox.z,newWidth]);
              
              if(newWidth>=minWidth){
                  place(thisBox.x,thisBox.y,thisBox.z,newWidth,i);
              }	
          }
      }
    }


    womb.s8.material = new THREE.MeshPhongMaterial({
      color:        0xaaaa33,
      emissive:     0xaa1111,
      specular:     0xeeee99,
      shininess:    100000,
      ambient:      0x000000,
      //ambient:      0x110000,
      shading:      THREE.FlatShading,
      side:         THREE.DoubleSide,
      //wireframe:    true,
      opacity:      1,
      transparent:  true
    }); 

    /*womb.s8.material = new THREE.MeshNormalMaterial({
      //shading:THREE.SmoothShading, 
      
    });*/

    womb.s8.hoverMaterial = new THREE.MeshNormalMaterial();



    womb.s8.geo = new THREE.IcosahedronGeometry( 1 , 2  );
    womb.s8.audioGeometry = new AudioGeometry( womb.s8.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.straightScaleIn( 500 )
    });

    womb.s8.meshes = [];

    womb.s8.connectionGeometry = new THREE.Geometry();
    for( var i = 0; i < placingMatrix.length; i++ ){

      var p = placingMatrix[i];

      /*var mat = new THREE.MeshPhongMaterial({
        color:        0x000000,
        emissive:     0x440000,
        specular:     0x000000 ,
        shininess:    100000,
        ambient:      0x110000,
        shading:      THREE.FlatShading,
        //side:         THREE.DoubleSide,
        opacity:      0,
        transparent:  true
      });  


      womb.s8.connectionGeometry.vertices.push( new THREE.Vector3( p[0] , p[1], p[2] ) );
      if( i !=0 && i != 1 ) womb.s8.connectionGeometry.faces.push( new THREE.Face3( i-2, i-1, i ) );

      //var mesh = new THREE.Mesh( womb.s8.audioGeometry.geometry, mat );
      mesh.scale.multiplyScalar( p[3]/2 );
      mesh.position.x = p[0];
      mesh.position.y = p[1];
      mesh.position.z = p[2];

      womb.s8.meshes.push( mesh );*/
      //womb.s8.fractalScene.add( mesh );
      //
      womb.s8.connectionGeometry.vertices.push( new THREE.Vector3( p[0] , p[1], p[2] ) );
      if( i !=0 && i != 1 ) womb.s8.connectionGeometry.faces.push( new THREE.Face3( i-2, i-1, i ) );

    }


    womb.s8.connectionGeometry.computeFaceNormals();
    womb.s8.connectionGeometry.computeVertexNormals();
    womb.s8.connectionGeometry.normalsNeedUpdate = true;
    womb.s8.connectionGeometry.vertexNormalsNeedUpdate = true;
    womb.s8.connectionMesh = new THREE.Mesh( womb.s8.connectionGeometry, womb.s8.material );
    womb.s8.fractalScene.add( womb.s8.connectionMesh );

    womb.s8.update = function(){


      womb.s8.fractalScene.rotation.x += .004;
      womb.s8.fractalScene.rotation.y += .002;
      womb.s8.fractalScene.rotation.z += .001;


      var f =  LeapController.frame();

      var p1 , p2;
      if( f.hands[0] ){
        
        p1 = LeapController.leapToScene( f , f.hands[0].palmPosition );
        womb.s8.h1.position = p1;


      }

      if( f.hands[1] ){
        
        p2 = LeapController.leapToScene( f , f.hands[1].palmPosition );
        womb.s8.h2.position = p2;

      }

     
      if( !p1 ) p1 = new THREE.Vector3( 1000000000 , 0 , 0 );
      if( !p2 ) p2 = new THREE.Vector3( 1000000000 , 0 , 0 );

     
      var ch1l = 1000000; // check hand 1 length
      var ch1i  = 100000; // check hand 1 index

      var ch2l = 1000000;
      var ch2i  = 100000;

      /*for( var i = 0; i < this.meshes.length; i++ ){



        var m = this.meshes[i];

        m.rotation.x += .005;
        m.rotation.y += .002;
        m.rotation.z += .001;

        var p = m.position.clone();
        p.applyMatrix4( womb.s8.fractalScene.matrixWorld );
        
        
        var d1 = new THREE.Vector3().subVectors( p , p1 );
        var d2 = new THREE.Vector3().subVectors( p , p2 );

        var h1l = d1.length();
        var h2l = d2.length();

        if( h1l < ch1l ){

          ch1l   = h1l;
          ch1i   = i;

        }

        if( h2l < ch2l ){

          ch2l   = h2l;
          ch2i   = i;

        }

      }
    

      for( var i = 0; i < this.meshes.length; i++ ){

        var m = this.meshes[i];
        if( i == ch1i ){
          m.material = womb.s8.h1.material.clone();
          m.material.needsUpdate = true;
        }
        
        if( i == ch2i ){
          m.material = womb.s8.h2.material.clone();
          m.material.needsUpdate = true;
        }

      }*/


      //oClosest = closest;

      womb.s8.audioGeometry.update();

    }

    womb.s8.params.exitFinished = function(){

      console.log('sss');
      var m = this.meshes[i];

      for( var i = 0; i < this.meshes.length; i++ ){

        m.material = womb.s8.material.clone();
        m.material.needsUpdate = true;

      }

    }
  }

  module.exports = s8;


});






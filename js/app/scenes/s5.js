define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');
  var LeapController      = require('app/utils/LeapController'    );



  var s5 = {};


  s5.init = function( womb ){

    womb.s5 = womb.world.sceneController.createScene({
      transition:'scale',
      exitFinish: function(){

        for( var i = 0; i < this.scene.meshes.length; i++ ){

          var m = this.scene.meshes[i];
          m.material = this.scene.material.clone();
          m.material.needsUpdate = true;

        }

      }

    });

    womb.s5.light = new THREE.DirectionalLight( 0xeeeeee , .5 );
    womb.s5.light.position.set( 0 , 0 , 1 );
    womb.s5.scene.add( womb.s5.light );



    womb.s5.h1 = new THREE.Object3D();
    womb.s5.h1.material = new THREE.MeshPhongMaterial({
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
    womb.s5.h1.geometry = new THREE.SphereGeometry( womb.world.size / 10 );
    womb.s5.h1.mesh     = new THREE.Mesh( womb.s5.h1.geometry , womb.s5.h1.material ); 
    womb.s5.h1.mesh.position.z = -womb.world.size * 2;
   // womb.s5.h1.add( womb.s5.h1.mesh );
    womb.s5.scene.add( womb.s5.h1 );

    womb.s5.h2 = new THREE.Object3D();
    womb.s5.h2.material = new THREE.MeshPhongMaterial({
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
    womb.s5.h2.geometry = new THREE.SphereGeometry( womb.world.size / 10 );
    womb.s5.h2.mesh     = new THREE.Mesh( womb.s5.h2.geometry , womb.s5.h2.material ); 
    womb.s5.h2.mesh.position.z = -womb.world.size * 2;
   // womb.s5.h2.add( womb.s5.h2.mesh );
    womb.s5.scene.add( womb.s5.h2 );


    womb.s5.fractalScene = new THREE.Object3D();
    womb.s5.scene.add( womb.s5.fractalScene );

    womb.s5.fractalScene.position.z = -womb.world.size;


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
    var complexity      = 3;
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


    womb.s5.material = new THREE.MeshPhongMaterial({
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

    womb.s5.hoverMaterial = new THREE.MeshNormalMaterial();



    womb.s5.geo = new THREE.IcosahedronGeometry( 1 , 2  );
    womb.s5.audioGeometry = new AudioGeometry( womb.s5.geo , womb.stream , {
      analyzingFunction: AnalyzingFunctions.straightScaleIn( 500 )
    });

    womb.s5.meshes = [];

    for( var i = 0; i < placingMatrix.length; i++ ){

      var p = placingMatrix[i];

      var mat = new THREE.MeshPhongMaterial({
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


      var mesh = new THREE.Mesh( womb.s5.audioGeometry.geometry, mat );
      mesh.scale.multiplyScalar( p[3]/2 );
      mesh.position.x = p[0];
      mesh.position.y = p[1];
      mesh.position.z = p[2];

      womb.s5.meshes.push( mesh );
      womb.s5.fractalScene.add( mesh );
    }



    womb.s5.update = function(){


      womb.s5.fractalScene.rotation.x += .004;
      womb.s5.fractalScene.rotation.y += .002;
      womb.s5.fractalScene.rotation.z += .001;


      var f =  LeapController.frame();

      var p1 , p2;
      if( f.hands[0] ){
        
        p1 = LeapController.leapToScene( f , f.hands[0].palmPosition );
        womb.s5.h1.mesh.position = p1;

      }

      if( f.hands[1] ){
        
        p2 = LeapController.leapToScene( f , f.hands[1].palmPosition );
        womb.s5.h2.mesh.position = p2;

      }

     
      if( !p1 ) p1 = new THREE.Vector3( 1000000000 , 0 , 0 );
      if( !p2 ) p2 = new THREE.Vector3( 1000000000 , 0 , 0 );

     
      var ch1l = 1000000; // check hand 1 length
      var ch1i  = 100000; // check hand 1 index

      var ch2l = 1000000;
      var ch2i  = 100000;

      for( var i = 0; i < this.meshes.length; i++ ){



        var m = this.meshes[i];

        m.rotation.x += .005;
        m.rotation.y += .002;
        m.rotation.z += .001;

        var p = m.position.clone();
        p.applyMatrix4( womb.s5.fractalScene.matrixWorld );
        
        
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
          m.material = womb.s5.h1.material.clone();
          m.material.needsUpdate = true;
        }
        
        if( i == ch2i ){
          m.material = womb.s5.h2.material.clone();
          m.material.needsUpdate = true;
        }

      }


      //oClosest = closest;

      womb.s5.audioGeometry.update();

    }

    womb.s5.params.exitFinished = function(){

      console.log('sss');
      var m = this.meshes[i];

      for( var i = 0; i < this.meshes.length; i++ ){

        m.material = womb.s5.material.clone();
        m.material.needsUpdate = true;

      }

    }
  }

  module.exports = s5;


});






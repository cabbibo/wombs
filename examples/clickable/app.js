define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                  );
  
  var FractalBeing       = require( 'Species/Beings/FractalBeing');

  var m                   = require( 'Utils/Math'                 );
  
  var Mesh                = require( 'Components/Mesh' );
  var Clickable           = require( 'Components/Clickable' );
  var Duplicator          = require( 'Components/Duplicator' );
  
  /*
   
     Create our womb

  */
  var link = 'https://github.com/cabbibo/wombs/';
  var info =  "The Clickable Component provides a mesh with 3 functions:<br/><br/>-onClick<br/>-onHoverOver<br/>-onHoverOut<br/><br/>Click Link for source.<br/> press 'x' to hide interface";

  
  var womb = new Womb({
    title:            'Clickable',
    link:             link, 
    summary:          info,
    stats: true,
    raycaster: true,
  });

  var being = womb.creator.createBeing();

  var directions = [
    
    [  0 ,  0 ,  1 ],
    [  0 ,  1 ,  0 ],
    [  1 ,  0 ,  0 ],
    [  0 ,  0 , -1 ],
    [  0 , -1 ,  0 ],
    [ -1 ,  0 ,  0 ]
  
  ]

  var lights = [];
  
  for( var i = 0; i < 6; i++ ){
  
    var color = new THREE.Color()
    color.setRGB( Math.random(),  Math.random() , Math.random() );

    var light = new THREE.DirectionalLight( color );
    var dir   = directions[i];
    light.position.set( dir[0] , dir[1] , dir[2] );
    
    womb.scene.add( light );
    lights.push( light );

  }

  var geo     = new THREE.IcosahedronGeometry( womb.size/ 10 , 3  );

  var bright  = new THREE.MeshLambertMaterial({ color: 0xffffff , shading: THREE.FlatShading});
  var dark    = new THREE.MeshLambertMaterial({ color: 0x666666, shading: THREE.FlatShading });

  var mesh = new Mesh( being ,{
   
    geometry: geo,
    material: dark

  });

  var duplicator = Duplicator( mesh , being );
  duplicator.placeAll();
  duplicator.addAll();


  Clickable( mesh ,  {
   
    onClick: function(){

      for( var i = 0; i < lights.length; i++ ){

        var l = lights[i];
        l.color.setRGB( Math.random(),  Math.random() , Math.random() );
        m.setRandomVector( l.position );

      }

    },

    onHoverOver: function(){

      this.material = bright;
      this.materialNeedsUpdate = true;

    },
  
    onHoverOut: function(){

      this.material = dark;
      this.materialNeedsUpdate = true;

    }
    
  });

  womb.loader.loadBarAdd();

  womb.start = function(){

    being.enter();
   
  }


});

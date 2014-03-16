define(function(require, exports, module) {

  var Womb                = require( 'Womb/Womb'                  );
  
  var FractalBeing       = require( 'Species/Beings/FractalBeing');

  var m                   = require( 'Utils/Math'             );
  
  var Being               = require( 'Components/Being'       );
  var Mesh                = require( 'Components/Mesh'        );
  var Clickable           = require( 'Components/Clickable'   );
  var Duplicator          = require( 'Components/Duplicator'  );
  var Component           = require( 'Components/Component'   );
  
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

  var geo     = new THREE.IcosahedronGeometry( womb.size/ 10 , 3  );

  var being = new Being();

  var mesh = new Mesh( womb.defaults.geometry , womb.defaults.material );
  console.log( being._update );


  womb.loader.loadBarAdd();

  womb.start = function(){

    being.enter();
   
  }


});

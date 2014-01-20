define(function(require, exports, module) {

  var Womb                = require( 'app/Womb'                       );

  var Ring                = require( 'app/scenes/html5_webGL/Ring'    );
  var Text                = require( 'app/scenes/html5_webGL/Text'    );
  var Image               = require( 'app/scenes/html5_webGL/Image'   );
  var Fan                 = require( 'app/scenes/html5_webGL/Fan'     );
  var Random              = require( 'app/scenes/html5_webGL/Random'  );


  var Intro               = require( 'app/scenes/html5_webGL/Intro'     );
  var HardLife            = require( 'app/scenes/html5_webGL/HardLife'  );
  var Coffee              = require( 'app/scenes/html5_webGL/Coffee'    );
  /*
   
     Create our womb

  */
  var link = 'http://soundcloud.com/';
  var info =  "Drag to spin, scroll to zoom,<br/> press 'x' to hide interface";
  
  womb = new Womb({
    cameraController: 'TrackballControls',
    modelLoader:      true,
    textCreator:      true,
    raycaster:        true,
    title:            'Turbulence: Finding and Making your Happy Place',
    link:             link, 
    summary:          info,
    gui:              true,
    imageLoader:      true,
    stats:            true,
    color:            '#000000',
    failureVideo:     84019684,
    test: true,
    size:             400
  });

  womb.stream = womb.audioController.createUserAudio();

  womb.audioController.gain.gain.value = 0;

  
  womb.scenes = [];

  var init = function(){
   

    womb.currentScene = 0;

    womb.intro = new Intro( womb );
    womb.scenes.push( womb.intro );
    
    womb.hardLife = new HardLife( womb );
    womb.scenes.push( womb.hardLife );

    womb.coffee = new Coffee( womb );
    womb.scenes.push( womb.coffee );





  }

  $(document).keypress(function(event){
      
    var whichKey=String.fromCharCode(event.which)
 
    if( whichKey == '1' )
      womb.nextEvent();
    
  });

  womb.nextEvent = function(){

    var scene = this.scenes[this.currentScene];

    scene.nextEvent();
  
    if( scene.currentEvent == scene.events.length ){
    
      this.currentScene ++; 

    }


  }

  // Set timeout for text loading
  var t = setTimeout( init , 1000 );

  womb.stream.onStreamCreated =  function(){
  
  
  }

  womb.loader.loadBarAdd();
  
  womb.update = function(){

  }

  womb.start = function(){

  }

  womb.raycaster.onMeshHoveredOver = function(){

  }

  womb.raycaster.onMeshHoveredOut = function(){

  }
  

});

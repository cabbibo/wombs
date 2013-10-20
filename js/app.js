
define(function(require, exports, module) {
    /*var a = require('a'),
        b = require('b');*/

    //var three = require('js/lib/three.min.js');
    var World           = require('app/World');
    var Toolbelt        = require('app/utils/Toolbelt');

    toolbelt = new Toolbelt();
    
    var loopsArray = [

      "audio/loops/1.mp3",
      "audio/loops/2.mp3",
      "audio/loops/3.mp3",
      "audio/loops/4.mp3",
      "audio/loops/5.mp3",
      "audio/loops/6.mp3",
      "audio/loops/7.mp3"

    ]

    toolbelt.loader.numberToLoad = loopsArray.length;

    for( var i = 0; i < loopsArray.length; i ++ ){

      toolbelt.audioController.createLoop( loopsArray[i] );

    }

    toolbelt.start = function(){

      toolbelt.audioController.playAllLoops();

    }

    toolbelt.loader.loadBarAdd();

    /*toolbelt.loader.onStart = function(){
      toolbelt.animator.start();
    }*/
  
});


define(function(require, exports, module) {

  var a  = require('lib/jquery-1.7.1.min');

  function Detector( womb , params ){

    this.params = _.defaults( params || {}, {
        
    });

    this.womb     = womb;


  }

  Detector.prototype.checkForGL = function () { 
  }

  Detector.prototype.checkForWebAudio = function(){


  }

  return Detector

});

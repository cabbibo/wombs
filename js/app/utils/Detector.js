define(function(require, exports, module) {

  var a  = require('lib/jquery-1.7.1.min');

  function Loader( womb , params ){

    this.params = _.defaults( params || {}, {
      numberToLoad:   1,
      loadGif:        "/wombs/lib/img/gifs/loadGif.gif"

    });

    this.womb     = womb;


  }

  return Loader

});

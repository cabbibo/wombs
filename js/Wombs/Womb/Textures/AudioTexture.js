define(function(require, exports, module) {

  function AudioTexture( audio ){

    var analyser = audio.analyser;

    var fbc = analyser.frequencyBinCount;

    // TODO: why 2 * 4 instead of 4 ?
    // fudge factor is to make sure texture reachs from 0 -> 1 in vUv coords
    var pixels = fbc / 8.2; 

    //creates a canvas element
    var canvas              = document.createElement('canvas');
    canvas.style.zIndex     = 999;
    canvas.style.position   = 'absolute';
    canvas.style.top        = '0px';

    // uncomment to see texture in upper left corner
    //document.body.appendChild( this.canvas );
    
    canvas.width = pixels;
    canvas.height = 1;
    
    var c = canvas.getContext('2d');

    var width = canvas.width;
    var height = canvas.height;

    var imageData = c.createImageData( width , height );

    c.putImageData( imageData , 0 , 0 );

    texture = new THREE.Texture( canvas );
    texture.update = textureUpdate.bind( texture )
    texture.analyser = analyser;
    texture.c = c;
    texture.pixels = pixels;
    texture.width = width;
    texture.height = height;

   // console.log( audio );

    return texture ;

  }

  textureUpdate = function(){

    if( this.analyser){

      var imageData = this.c.createImageData( this.width , this.height );

      //transfers audio data to rgb values
      for (var i = 0; i < this.pixels ; i++) {
        
        var x = i;
        var y = 0;
        var r = this.analyser.array[i]   | 0;
        var g = this.analyser.array[i+1] | 0;       
        var b = this.analyser.array[i+2] | 0;
        var a = this.analyser.array[i+3] | 0;
        setPixelData( imageData , x , y , r , g , b , a ); 
      
      }


      this.c.putImageData( imageData , 0 , 0 );

      //updates the texture
      this._needsUpdate =  true;

    }

    //console.log('ss');

  }

  //TODO: Move this to canvasFunctions

  setPixelData = function ( imageData, x, y, r, g, b, a) {

      index = ( x + y * imageData.width ) * 4;
      imageData.data[index+0] = r;
      imageData.data[index+1] = g;
      imageData.data[index+2] = b;
      imageData.data[index+3] = a;

  }
  
  module.exports = AudioTexture;

});


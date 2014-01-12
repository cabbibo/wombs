define(function(require, exports, module) {

  var a  = require('lib/jquery-1.7.1.min');

  function Loader( womb , params ){

    this.params = _.defaults( params || {}, {
      numberToLoad:   1,
      loadGif:        "/lib/img/gifs/loadGif.gif"

    });

    
    this.womb     = womb;

    this.numberLoaded = 0;
    this.numberToLoad = this.params.numberToLoad;

    this.curtain = document.createElement('div');
    this.curtain.id = "curtain";

    document.body.appendChild( this.curtain );


    this.loadBar = document.createElement('div');
    this.loadBar.id = "loadBar";

    this.loadInfo = document.createElement('div');
    this.loadInfo.id = 'loadInfo';

    this.curtain.appendChild( this.loadInfo );
    
    this.loadBarAddAmount = window.innerWidth / this.numberToLoad;

    this.curtain.appendChild( this.loadBar );

    this.loadingGif     = document.createElement( 'img' );
    this.loadingGif.src = this.params.loadGif;
    this.loadingGif.id  = 'loadingGif';



    var curtainTemp = this.curtain;

    this.loadingGif.onload = function(){
   
      var margin = this.height + 10
      this.style.marginLeft  = "-" + this.width / 2 + "px";
      this.style.marginTop   = "-" + margin + "px";
      curtainTemp.appendChild( this );

    }

    // Conditions are things that will check each time something 
    // new is loaded, allowing us to start putting together certain parts
    // of the program after a specific condition is made
    this.conditions = [];

    // Failures are things that the browser doesn't have.
    // If there are a non 0 number of failures the user will be alerted
    this.failures = [];


  }

  Loader.prototype = {


    addLoadInfo: function(s){

      this.loadInfo.innerHTML = s;
    },

    addToLoadBar: function(){

      this.numberToLoad ++;
      this.updateLoadBar();

    },

    updateLoadBar: function(){


      this.loadBarAddAmout = window.innerWidth / this.numberToLoad;

      var loadBarWidth = this.loadBarAddAmount * this.numberLoaded;
      this.loadBar.style.width = loadBarWidth + "px";

    },


    loadBarAdd: function(){

      
      var oldWidth = parseInt( this.loadBar.style.width );
      var newWidth = oldWidth + this.loadBarAddAmount;

      this.loadBar.style.width = newWidth + "px";

      this.numberLoaded ++;

      this.checkConditions();

      if( this.numberLoaded == this.numberToLoad ){
        this.onFinishedLoading();
      }


    },


  
    // This will run through all of our saved conditions
    // and trigger whatever is necessary when we need to
    checkConditions: function(){

      for( var i = 0; i < this.conditions.length; i++ ){

        console.log( 'conditions checked' );
        var c = this.conditions[i];

        console.log( c );
        console.log( c[0] );
        if( c[0] ){
          c[1];
          this.conditions.splice( i , 1 );
        }

      }

    },

    addCondition: function( condition , callback ){
      this.conditions.push( [ condition , callback ] ); 
    },

    addFailureDialog: function(){

      this.failureDialog = document.createElement('div');
      this.failureDialog.id = "failure";

      this.curtain.appendChild( this.failureDialog );

      var failureTitle = document.createElement('h1');
      failureTitle.innerHTML = 'LOADING FAILURE';
      this.failureDialog.appendChild( failureTitle );

      this.failureDialog = d;
      alert(d);

    },

    addFailure: function( failureName , failureLink ){

      if( !this.failureDialog )
        this.addFailureDialog();

      //var failureName = 
      this.failures.push( [failureName,failureLink] );

    },

    onFinishedLoading: function(){
   
      var self = this;
      
      $(this.curtain).fadeOut('slow',function(){
        self.onStart();
      });

    },

    onStart: function(){
     
      this.womb._start();

    },

    
    detectWebGL: function(){

      var webGL = function() { try { return !! window.WebGLRenderingContext && !! document.createElement( 'canvas' ).getContext( 'experimental-webgl' ); } catch( e ) { return false; } };

      var gl = webGL();
      if( !gl ){
        this.addFailure("WebGL", [
          'Get WebGL',
          'http://get.webgl.org/'
        ])
      } 


    },

    detectWebAudioAPI: function(){

      try {
       
        // Fix up for prefixing
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        //context = new AudioContext();

      }
      catch(e) {

        this.addFailure( 

          'Web Audio API' ,
          [ 'List of browsers that support the Web Audio API' , 
            'http://caniuse.com/audio-api' ]
        ); 

      }

    }



  }

  return Loader

});

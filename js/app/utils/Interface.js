define( function( require , exports , module ){

  require( 'js/lib/jquery-1.7.1.min.js' );
  require( 'js/lib/dat.gui.min.js'      );


  function Interface( womb ){

    this.domElement = document.createElement('div');

    this.domElement.id              = 'interface';

    this.domElement.style.position  = 'absolute';
    this.domElement.style.top       = '0px';
    this.domElement.style.left      = '0px';
    this.domElement.style.width     = '100%';
    this.domElement.style.height    = '100%';
    this.domElement.style.zIndex    = '999';


    document.body.appendChild( this.domElement );

    if( womb.params.title )
      this.addTitle( womb.params.title );

    if( womb.params.info )
      this.addInfo( womb.params.info );

    if( womb.params.gui )
      this.addGUI();

    

    var self = this;

    $(document).keypress(function(event){
		var whichKey=String.fromCharCode(event.which)
	
		if(whichKey=='x'){
		  self.toggle();    
        }

    });



  }



  Interface.prototype.addTitle = function(title){

    this.title = document.createElement('h1');
    this.title.innerHTML = title;
    this.domElement.appendChild( this.title );

  }


  Interface.prototype.addInfo = function( info ){

    this.info = document.createElement('h2');
    this.info.innerHTML = info;
    this.domElement.appendChild( this.info );

  }

  Interface.prototype.addGUI = function(){


  }

  Interface.prototype.addUniformToGUI = function(){


  }

  Interface.prototype.toggle = function(){
 
    console.log('whooa');
    $( this.domElement ).toggle();

  }



  module.exports = Interface;




});

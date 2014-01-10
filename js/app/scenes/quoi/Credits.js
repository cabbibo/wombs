define(function(require, exports, module) {

  var m                   = require('app/utils/Math'              );
  var AudioGeometry       = require('app/three/AudioGeometry'     );
  var AnalyzingFunctions  = require('app/utils/AnalyzingFunctions');


  var Womb                = require( 'app/Womb'                       );

  var recursiveFunctions  = require( 'app/utils/RecursiveFunctions'   );
  
  var fragmentShaders     = require( 'app/shaders/fragmentShaders'    );
  var vertexShaders       = require( 'app/shaders/vertexShaders'      );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );
  var shaderChunks        = require( 'app/shaders/shaderChunks'       );

  var PhysicsSimulator    = require( 'app/shaders/PhysicsSimulator'   );
  var physicsShaders      = require( 'app/shaders/physicsShaders'     );


  function Credits( womb , params ){

    this.womb = womb;

    this.womb.loader.addToLoadBar();

    var self = this;
    this.params = _.defaults( params || {} , {

      spin: .001,
      color: new THREE.Vector3( .3 , .5 , 1.9 ),
      radius: 10,
      size:   .3,
      modelScale: 1,
      audioPower: 0.5,
      noisePower: 0.1,
      texture: self.womb.stream.texture.texture,
      geo: new THREE.CubeGeometry( 1 , 1 , 1 , 10 , 10 ,10 ),
      numOf: 50,

    });

    var loopFile = '/lib/audio/loops/quoi/creditsLoop.wav';
    this.audio = womb.audioController.createLoop( loopFile );
    this.world = this.womb.sceneController.createScene();

    this.scene = this.world.scene;

    this.texture = this.params.texture;

    var self = this;

    this.geo = this.params.geo;

    this.links = [];

    this.u = {
      texture:    { type: "t", value: womb.stream.texture.texture },
      image:      { type: "t", value: womb.stream.texture.texture },

      color:      { type: "v3", value: this.params.color },
      time:       womb.time,
      pow_noise:  { type: "f" , value: 0.01 },
      pow_audio:  { type: "f" , value: .04 },
    }


    this.t_CENTER = this.womb.textCreator.createTexture( 'QUOI', {square:true} );

    this.u_CENTER= THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        this.u,
    ]);

    this.u_CENTER.time          = this.womb.time;
    this.u_CENTER.image.value   = this.t_CENTER;
    this.u_CENTER.texture.value = this.audio.texture.texture;
    this.u_CENTER.color.value   = new THREE.Vector3( 1.0 , 1.0 , 1.0 );

    this.m_CENTER = new THREE.ShaderMaterial( {
      uniforms:       this.u_CENTER, 
      vertexShader:   vertexShaders.audio.noise.position,
      fragmentShader: fragmentShaders.audio.color.image.sample_pos_diamond,
      transparent:    true,
      fog:            true,
      opacity:        0.1,
      side:           THREE.DoubleSide
    });

    this.CENTER = new THREE.Mesh(
      new THREE.PlaneGeometry( 30 , 30 , 100 , 100 ),
      this.m_CENTER
    );


    var i = '../lib/img/icons/cabbibo_1.png';
    var t = 'AVALON EMERSON';
    var l = 'https://soundcloud.com/avalonemerson';
    this.AVALON = this.createLink( i , t , l);  

     var i = '../lib/img/icons/cabbibo_1.png';
    var t = 'ICEE HOT';
    var l = 'http://iceehot.com';
    this.ICEEHOT = this.createLink( i , t , l);    

    var i = '../lib/img/icons/cabbibo_1.png';
    var t = 'CABBIBO';
    var l = 'http://cabbibo.com';
    this.CABBIBO = this.createLink( i , t , l);    

    var i =  '../lib/img/icons/TWITTER_1.png';
    var t = 'TWITTER';
    var l = "http://twitter.com/share?text=@avalon_emerson's%20Quoi,%20Visualized%20by%20@cabbibo&url=http://wom.bs/quoi/";
    this.TWITTER = this.createLink( i , t , l );    

    var i =  '../lib/img/icons/TWITTER_1.png';
    var t = 'FACEBOOK';
    var l = "http://twitter.com/share?text=@avalon_emerson's%20Quoi,%20Visualized%20by%20@cabbibo&url=http://wom.bs/quoi/";
    this.FACEBOOK = this.createLink( i , t , l );    

    var i =  '../lib/img/icons/TWITTER_1.png';
    var t = 'SOUNDCLOUD';
    var l = "https://soundcloud.com/avalonemerson";
    this.SOUNDCLOUD = this.createLink( i , t , l );    



    var s = this.params.size;

    this.AVALON.scale.multiplyScalar(     s );
    this.ICEEHOT.scale.multiplyScalar(    s );
    this.CABBIBO.scale.multiplyScalar(    s );
    this.TWITTER.scale.multiplyScalar(    s );
    this.FACEBOOK.scale.multiplyScalar(   s );
    this.SOUNDCLOUD.scale.multiplyScalar( s );

    
    
    this.AVALON.position.y      = 80  ;
    this.ICEEHOT.position.y     = 80  ;
    this.CABBIBO.position.y     = 80  ;
    
    this.TWITTER.position.y     = -80 ;
    this.FACEBOOK.position.y    = -80 ;
    this.SOUNDCLOUD.position.y  = -80 ;


    this.AVALON.position.x      = -100;
    this.ICEEHOT.position.x     = 0   ;
    this.CABBIBO.position.x     = 100 ;

    this.TWITTER.position.x     = -100;
    this.FACEBOOK.position.x    = 0   ;
    this.SOUNDCLOUD.position.x  = 100 ;


    //this.CENTER.position.y = 70;

    this.scene.add( this.ICEEHOT    );
    this.scene.add( this.AVALON     );
    this.scene.add( this.CABBIBO    );
    this.scene.add( this.TWITTER    );
    this.scene.add( this.FACEBOOK   );
    this.scene.add( this.SOUNDCLOUD );


    this.size = this.womb.size / 50;
 
    var numOf = this.params.numOf;


    var c = this.womb.container;

    document.addEventListener( 'click', this.click.bind( this ));
    c.addEventListener( 'mousedown', this.mouseDown.bind( this ));
    c.addEventListener( 'mouseup', this.mouseUp.bind( this ));
   // c.addEventListener( 'onmouseover', this.mouseDown.bind( this ));

    this.womb.loader.loadBarAdd();

    this.world.update = this.update.bind( this );

  }


  Credits.prototype.createLink = function( image , text , link ){

    var image = this.womb.imageLoader.load( image );
 
    var uniforms =  THREE.UniformsUtils.merge( [
        THREE.ShaderLib['basic'].uniforms,
        this.u,
    ]);

    uniforms.time             = this.womb.time;
    uniforms.image.value      = image;
    uniforms.texture.value    = this.audio.texture.texture;

    var material = new THREE.ShaderMaterial( {
      uniforms:       uniforms, 
      vertexShader:   vertexShaders.passThrough,
      fragmentShader: fragmentShaders.audio.color.image.sample_pos_diamond,
      transparent:    true,
      fog:            true,
      opacity:        0.1,
      //side:           THREE.DoubleSide
    });

    var mesh = new THREE.Mesh( this.params.geo  , material );
    text = this.womb.textCreator.createTexture( text );
    
    mesh.image  = image;
    mesh.text   = text;
    mesh.link   = link;

    this.links.push( mesh );
    return mesh;


  }


  Credits.prototype.update = function(){

  }

  Credits.prototype.click = function( e ){

  }


    console.log('check');


  Credits.prototype.mouseDown = function(){

    console.log('CH');

    for( var i = 0; i < this.links.length; i++ ){

      var l = this.links[i];

      if( l.active ){
        l.selected = true;
      }


    }

  }

  Credits.prototype.mouseUp = function(){

    console.log('wha');
    for( var i = 0; i < this.links.length; i++ ){

      var l = this.links[i];

      if( l.selected && l.active ){
        window.open( l.link , '_blank' );
      }else{
        l.selected = false;
      }

    }

  }



  Credits.prototype.onMeshHoveredOver = function(object){

    this.audio.filter.frequency.value = 2000;
    for( var i = 0; i < this.links.length; i++ ){

      var l = this.links[i];

      if( object == l ){
        object.active = true;


        this.CENTER.material.uniforms.image.value = object.text;
        this.CENTER.scale.x = object.text.scaledWidth;
        this.CENTER.scale.y = object.text.scaledHeight;
        this.scene.add( this.CENTER );

        object.material.uniforms.color.value = new THREE.Vector3( 1.0 , 1.0 , 1.0 );

      }

    }

     

  }

  Credits.prototype.onMeshHoveredOut = function(object){

    this.audio.filter.frequency.value = 1200;

     for( var i = 0; i < this.links.length; i++ ){

      var l = this.links[i];

      if( object == l ){

        object.active = false;
        object.selected = false;
        //this.scene.remove( object.text );
        this.scene.remove( this.CENTER );
        object.material.uniforms.color.value = this.params.color;
      }

    }


  }


  Credits.prototype.update = function(){

    for( var i = 0; i < this.links.length; i++ ){

      this.links[i].rotation.x += Math.sin( i ) * .02;
      this.links[i].rotation.y += Math.cos( i ) * .02;
      this.links[i].rotation.z += Math.sin( i * 55.3 ) * .02;

    }


  }


  Credits.prototype.enter = function(){
    this.audio.play();
    this.audio.gain.gain.value = 0.0
    this.audio.fadeIn( 10 );
    this.audio.turnOnFilter();
    this.world.enter();
  }

  Credits.prototype.exit = function(){
    this.audio.fadeOut();
    this.world.exit();
  }

  module.exports = Credits;

});

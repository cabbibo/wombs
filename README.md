
/*

   NOTES

*/

Constant Work In Progress. Feel Free To Jump in and help out, or send me any suggestions!
@cabbibo


//SHADER NOTES:

  - If using THREE.js shaders, need to reassign the values assigned in the original shader
  - using SC.modelView, because we want to do all teh 'pos' stuff BEFORE we define
  - Flip flop is to change from one mat to another


// TODO NOTES:




  PRE ALPHA:

  - figure out physics simulation particles
  - Clean up code
  - Figure out make and make build!
  
  - Try to make more things into functions that return what you want!
    - these components are healthier for modularity

  - Try to set up some standards for vertex and fragment shaders,
    - so it is easier to seperate the two!


  - Textures should be utils, not in Wombs!


  Organization:

    -Womb ( World )
        
        - Audio
          - AudioController.js
          - Audio.js
          - Looper.js
          - UserAudio.js
          - Stream.js
          - 
        - Camera
          - Controls
            - LeapFlyControls.js
            - MomentumControls.js
            - etc
          - CameraController.js

        - Physics
          - Global Forces
          - forces that can be assigned to single being

        - Loading
          - ObjLoader.js
          - JsonLoader.js
          - ImageLoader.js
          - ModelLoader.js


        - Raycaster.js
      
        - EffectComposer.js
  
        - LinkCreator.js (???)
        

        - Textures
          - UserMediaTexture.js
          - VideoTexture.js
          - AudioTexture.js
          - TextCreator.js


        - World.js
        
        - Creator

        - Loader.js
        - Interface.js
        - Animator.js
        - Detector.js
        - 
      

    - Being ( Game Object / Scene )
        - Physics
          - Mass
          - Types of forces to add

        - Body
          - Geometry
          - Material
          - Arrangement( default is single Geometry )
            - Placement
            - Tweening functions such as fan out


        - Prefabs
          


    // THings that are not 'Womb' dependent
    - Utils
      - CanvasFunctions.js
      - Math.js
      - RecursiveFunctions.js
      - PlacementFunctions.js
      - helperFunctions.js


    - Shaders

   
  - Placement Functions:
     - Random Sphere edge,
     - Random Placed,
     - Recursive Random
     - Pure Circle,
     - Line,
     - Grid


  - loader conditions
  - loader.failure() to be called on errors
  - loader.addFailure();
  - loader.onFailure();   // To make sure there are no extra
  - loader.failureDOM to be called whenever a application doesn't work.


  /Time
      - including on specific beats, at certain times, 






  /*

     SHADERS

  */

  // Update ShaderLib
    - Grab some new shaders for shaderLib:
    - Cross hatch shader and some of jaume's tools
      
  // Data to JSON GPU SHADER
  
    - create 'transition shader'



  // Create Meta Balls





  /*

     ORGANIZATION

  */


  /*

    STORY IDEA:

    Holy other Album Music Video
    Music game mixtape
    Universe Of Sound remix
    ASMR Kids book

    

  */


  /*

    Holy Other Almbum Music 

  */

  // Chapter 1: ( W )here

    0:00
    - Rocket ship blasting off into space ( entering the unknown ), 
    - begin seeing new things,
        - Possibly a ring sort of like omsi
        - physchedlic 
        -similar to 'I nevernt Learned to Share' Animation
        -On 


  // Chapter 1: Loss
  // Entropy and disappation. 
  users can follow whatever path they want, and by the end get to 'earth'



  // WE OVER:

  Lead users along path by showing them orbs that they can follow if they wish to.
  - Create 'possible points' array of next 'guide orb', one orb per 'section'
  - Each 'section' test for closest 'guide orb',
  - some sort of sub-particle system spawns for each guide orb to give the users comfort,
    and reward them for following path. 


  - end of Path is Earth which leads to :


 
  // NEXT SONG

  - The path of lonliness ( aka not hitting any guides has its own reward if user makes it to the end ( 
        easter egg )
  
  
  // THANK YOU NOTES:

  http://threejs.org

  Reza Ali
  Robbie
  http://jabtunes.com/labs/3d/gpuflocking/webgl_gpgpu_flocking3.html
  Theo Armor

  West Langley
  Kali
  IQ




   

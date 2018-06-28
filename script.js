document.addEventListener("DOMContentLoaded", start);

function start(){
  
  var player = document.querySelector('#player');
  var theBall = document.querySelector('#theBall');
  var ballButton = document.querySelector('#ballButton');
  var ballButtonText = document.querySelector('#ballButtonText');

  ballButton.addEventListener("click", showBall);

  var hideBall = true;
  
  function showBall(){
    hideBall = false; //This effects the "tick" function approximately 40 lines down
    ballButtonText.setAttribute("text", "value", "Position the ball using the WSAD keys, then click it.");
    ballButton.removeEventListener("click", showBall);
    theBall.addEventListener("click", dropBall);
  }

  function dropBall(){
    this.removeAttribute("static-body"); //Bodies must be static if you want to be able to move and rotate them by simply changing variables.
    this.setAttribute("dynamic-body", ""); //Once bodies are dynamic, you can't move or rotate them in the usual way.  Only VECTORS (forces) can move them.
    theBall.removeEventListener("click", dropBall);
    ballButtonText.setAttribute("text", "value", "Click the ball again to apply a push!"); // setAttribute can take three arguments.  Adding the third argument lets you change small parts of a long attribute/component value.
    theBall.addEventListener("click", pushBall);
  }

  var rotationOfPlayerOnYAxisInRadians; // This will keep track of how much the player has turned (or "spinned"). More specifically, it will keep track of how much the player has turned on his or her Y axis. If you don't understand radians, don't worry, they're pretty simple: 360 degrees = 2 PI radians (or about 6.28 radians); 180 degrees = PI radians; 90 degrees = PI/2 radians; etc.)

  var firstComponentOfPlayerRotation; // "Component" here does NOT refer to an A-Frame component/attribute.  Instead, "component" here refers to the components of a VECTOR.  You can think of a vector as the hypotenuse of a right triangle.  A vector's components are simply the other two sides of the right triangle (more below).  In other words, vector components/sides allow us to more easily work with diagonal things (e.g. diagonal movements, diagonal velocities, etc.).  Vectors are the main building blocks of every physics engine!

  var secondComponentOfPlayerRotation; // This variable and the one above are the most complicated part of the whole program!  Here's an explanation:

  //The bowling ball needs to be pushed only along it's X- and Z-axes (since pushing along the Y would send it up/down).  However, the amount of X-force vs the amount of Z-force depends on the Y rotation of the player!  For example, if the player points straight forward in the game——directly at the pins——then we would expect the ball to receive a 100% Z-force and 0% X-force.  Once the player begins to spin on his/her Y-axis, the needed Z-force decreases while the needed X-force increases.  If the player turns all the way to the left——meaning 90 degrees, or half PI in radians——the ball will need a negative 100% X-force and 0% Z-force.  If the player turnes directly right, or 270 degress, the ball will need a postive 100% X-force and a 0% Z-force.

  //In order to ensure that we always have the proper percentage of X and Z forces, we need to use sine and cosine.  Don't freak out!  Here's how we do it:

  //Imagine that you are the player and that you are turned 45 degrees to the left. Now imagine a line coming directly out of your chest that is exactly one "unit" in length.  That one-unit line sticking out from your chest can be thought of as the hypotenuse of a right triangle!  Therefore, all we need to do is apply trigonmetry using the hypontenuse (1 unit) and the angle (45 degrees) in order to calculate the components/sides of the diagonal line.

  //And since those components/sides (again: the other sides of the right triangle sticking out of your chest) align perfectly with X- and Z-axes of our A-Frame world, we can use those components/sides to express the amount of X- and Z-force that we want to apply to the ball!

  //We use sine to find one side and cosine to find the other.  Since our hypotenuse is one, SOH CAH TOA becomes very simple. It boils down to:

  //side1 = sin(angle)
  //side2 = cos(angle)

  //Try rearranging the SOH CAH TOA formulas using hypotenuse 1 in order to see how these formulas are simplified.

  var tickerCounter = 0;
  AFRAME.registerComponent('player-monitor', { // If you haven't read about how make your own components/attributes in A-Frame, take a look at the documentation. (Note: Here I'm back to talking about "components" as ATTRIBUTES. It's a bit confusing!)

    tick: function(){ // A tick is a single redraw of the entire scene.  Tick functions are called 90 times every second. (In other words: the rate at which A-Frame redraws everything.)  If you need a variable to be constantly updated, then you need to add at least one tick function to your scene's script.
      tickerCounter++; // For debugging purposes

      rotationOfPlayerOnYAxisInRadians = this.el.object3D.rotation.y; //This is how we access the rotation of an object along an axis.  Since I attached this component/attribute to the player, I can use "this.el...".

      firstComponentOfPlayerRotation = Math.sin(rotationOfPlayerOnYAxisInRadians); //Here's the trigonomtey discussed above
      secondComponentOfPlayerRotation = Math.cos(rotationOfPlayerOnYAxisInRadians);

      if (hideBall === false){ //The ball actually starts as static-body underneath the green platform.  Once I turn this boolean variable to false, the ball begins to follow the player. (Note: It's still a static-body when following the player!)
        var playerXposition = this.el.object3D.position.x;
        var playerYposition = this.el.object3D.position.y; // We use these variables to access the player's position;
        var playerZposition = this.el.object3D.position.z;

        theBall.setAttribute("position", `${playerXposition} ${playerYposition} ${playerZposition - 2}`);
      }

      if (tickerCounter === 89){ // For debugging purposes
        console.log("-----One second just passed-----");
        console.log("First component of player rotation: " + firstComponentOfPlayerRotation);
        console.log("Second component of player rotation: " + secondComponentOfPlayerRotation);
        tickerCounter = 0;
      }
    }
  });

  function pushBall(){
    //Note: This function only works because the ball at this point has been changed to a dynamic-body.  (See dropBall function above.)
    var Xpush = firstComponentOfPlayerRotation * -22;
    var Zpush = secondComponentOfPlayerRotation * -22; //Since we used a hypotenuse of 1 to calculate these vector components, we now need to multiply each one before using them in a "push" vector (see below).  Otherwise, the push vector might be very weak.

    //I'm honestly not sure why we need NEGATIVE 22 here.  Regular 22 was sending it in exactly the opposite direction that I wanted, so I just made it negative.

    var push = new CANNON.Vec3(Xpush, 0, Zpush); //This is how you create a vector.  Try playing around with this push vector by substituting your own numbers.  Note that the Y-component of the vector is kept at zero, since we don't want the ball to move up or down.

    console.log(push);
    theBall.body.velocity = push; //This is how you actually APPLY the vector.  (There may additional ways to apply this vector that I don't understand yet.)  Basically, you're setting the ball's velocity to the vector you created.  This means the ball will immediately start moving at this new velocity.  However, it's velocity will also immediately begin to slow down, since other vectors (namely, friction & drag vectors built into the physics engine) will work against velocity.
    ballButtonText.setAttribute("text", "value", `You knocked-over ${pinsKnocked} pins!`);
  }

  var pinsKnocked = 0;
  AFRAME.registerComponent('pin-monitor', {
    tick: function(time, timeDelta){ //Another tick function firing at 90 times per second.  This one is attached to all 10 pins.
      var pin = this.el;
      if ((Math.abs(pin.object3D.rotation.x) > 0.78) || (Math.abs(pin.object3D.rotation.z) > 0.78)){ // A fully knocked-over pin would mean that it's rotated about 1.57 radians (or, more specifically, PI/2 radians) on either its X- or Z-axis.  Therefore, I reduced the "knocked-over" threshhold to about half that (0.78 radians) to account for pins that are knocked-over but still partially propped-up.
        console.log(`${this.el.id} tipped!`);
        pinsKnocked++;
        ballButtonText.setAttribute("text", "value", `You knocked-over ${pinsKnocked} pins!`);
        this.el.removeAttribute("pin-monitor");
      }
    }
    //Design note: I mostly designed the bowling pin object using TinkerCad.com.  I only used Blender to adjusted the pin's origin/center of gravity.
  });

  //I made the below function as an eary debugging/learning tool.  (It has nothing to do with the game.)  Click on the red box to make the cone point in the same direction as the player.
  var cone = document.querySelector('#cone');
  var redBox = document.querySelector('#redBox');
  redBox.addEventListener("click", turnCone);
  function turnCone(){
    //Note that the cone is static.  This function won't work on a dynamic-body!
    var xConeRotation = player.object3D.rotation.x;
    var yConeRotation = player.object3D.rotation.y;
    var zConeRotation = player.object3D.rotation.z;

    cone.object3D.rotation.y = yConeRotation;
    cone.object3D.rotation.x = xConeRotation - (Math.PI / 2); // Not sure why I had to subtract PI/2 to get this work.  It probably has to do with how the cone is initially positioned.
  }
}

# A-Frame-Bowling-Game

The script.js file is extensively notated.  My comments attempt to make the code as accessible as possible.  Here is a summary of the comments.

•	Lines 22-28 discuss how only static-bodies can be moved/rotated through direct manipulation of variables/properties.  Dynamic bodies, on the other hand, can only my manipulated by applying forces.

•	Lines 30 to 49 are the most complicated, but also the most exciting.  These lines discuss forces—aka vectors—and how they can be used alongside trigonometry.  I highly recommend Dan Shiffman’s “Nature of Coding” YouTube series as an extremely accessible way to learn more about vectors:
https://www.youtube.com/watch?v=6vX8wT1G798&list=PLRqwX-V7Uu6YVljJvFRCyRM6mmF5wMPeE

•	Lines 51 to 55 discuss defining your own A-Frame component/attribute.  Most importantly, it shows how defining your own attribute allows you to create a “tick” function.  A tick function is called 90 times per second, which makes it incredibly useful for continuous monitoring of variables/properties.

•	Lines 57 to 67 show how the position and rotation of dynamic bodies can be captured and utilized.

•	Lines 79 to 89 show how a vector that you’ve created (based on the player’s rotation) can be applied as a “push” force.

•	Lines 94 to 103 show how another component/attribute’s tick function can be used to monitor whether a bowling pin has tipped over.

const canvas = document.getElementById('canvas1');
// 'ctx' is a naming convention for 'context';
// this will tell JS to use 2d drawing methods
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;
ctx.font = "20px Arial";

let savedDroids = 0;
let troopersStopped = 0;

const keys = []; // empty array to which we'll add key identifiers
const villains = []; // empty array to which we'll add our villains
characterActions = ['up','down','left','right'];

// We'll increment this number each time a good guy is added to the screen
let goodGuyCount = 0

let gameOver = false // change to true if not enough droids saved
let youWin = false // you get the idea

// Create empty object to hold images
const images = {};
// Droid1 image mapping
images.droid1 = new Image();
images.droid1.src = 'protocoldroid1.png';
// Droid2 image mapping
images.droid2 = new Image();
images.droid2.src = 'protocoldroid2.png';

// MAKE PLAYER OBJECT
// Using 128x192 Mandalorian from: http://untamed.wild-refuge.net/images/rpgxp/mandalorian2.png
const player = {
    x: 200,
    y: 200,
    width: 32, // Sprite sheet is 128px wide, containing 4 frames
    height: 48, // Sprite sheet is 192px high, containing 4 frames
    frameX: 0, // X coord of frame we cut out of sprite sheet
    frameY: 2, // Y coord of frame we cut out of sprite sheet
    speed: 9, // how many pixels we move per frame of animation
    moving: false,
};

// MAKE NPC OBJECTS
const cThreePO = {
    sprite: '/static/games/star_wars_mando/protocoldroid1.png',
    width: 32,
    height: 48,
}
const droidSilver = {
    sprite: '/static/games/star_wars_mando/protocoldroid2.png',
    width: 32,
    height: 48,
}

// Array from which we can select a character
//const goodGuys = [cThreePO, droidSilver]; 
const goodGuys = [];

// Randomly choose character from goodGuys
//let whichChar = goodGuys[Math.floor(Math.random() * goodGuys.length)]
let whichChar = cThreePO;

// MAKE GOOD GUY CLASS
class GoodGuy {
    constructor(){
        // Each instance of GoodGuy will have these attributes:
        this.width = whichChar.width; // width of sprite cell, based on whichChar
        this.height = whichChar.height; // height of sprite cell, based on whichChar
        this.frameX = 0; 
        this.frameY = 3;
        this.x = Math.random()*100, // draw sprite at random x loca from 0 to 100
        this.y = canvas.height + (Math.random()*400)+50 // draw sprite just off screen in the y direction
        this.speed = (Math.random() * 2.5) + 2; // Random speed between 6.5 and 9
        this.action = characterActions[0];        
    }
    // Create a custom class-method 
    draw(){
        // and add in this function that we also made:
        drawSprite(
            //NEED AN 'IMAGES' LINE: player uses 'images.player' try this:
            images.droid1,
            this.frameX * this.width, // x position of slice
            this.frameY * this.height, // y position of slice
            this.width, // width of slice
            this.height, // height of slice
            this.x, // x pos to draw the sprite
            this.y, // y pos to draw the sprite
            this.width, // how wide to draw it on the canvas
            this.height, // how tall to draw it on canvas
        )
        // Include sprite animation in the draw function because draw func occurs each frame
        // NOTE, we're not moving the character here, just animating its sprite
        if (this.frameX < 3){
            this.frameX++;
        }else{
            this.frameX = 0;
        }
    }
    // Create another custom class method to move our sprites
    update(){
        if (this.y > 100){
            this.y -= this.speed;
        }else{
            goodGuys.splice(goodGuys.indexOf(this), 1);
            savedDroids++            
        }

        for (let i=0; i < villains.length; i++){
            if (collide(this, villains[i])){
                goodGuys.splice(goodGuys.indexOf(this), 1);                
            }
        }
    }
}
// Replace this with a for loop later to make multiple NPCs
for (let i = 0; i < 15; i++){
    goodGuys.push(new GoodGuy());
}

images.stormtrooper = new Image();
images.stormtrooper.src = '/static/games/star_wars_mando/stormtrooper.png';
let howManyVillains = 15

class BadGuy {
    constructor(){
        this.width = 32;
        this.height = 48;
        this.frameX = 0;
        this.frameY = 1;
        this.x = canvas.width + Math.random()*canvas.width + 100; // starting x coord is random position between 0 and width of canvas
        this.y = canvas.height - Math.random()*(canvas.height - 100); // starting y coord is random pos between 0 and canvas height, less the character height
        this.speed = Math.random()*3 + 4.5;
        this.action = 'left'; // all bad guys default heading left
        this.canInteract = true
    }
    draw(){
        drawSprite(
            images.stormtrooper,
            this.frameX * this.width, // x location of slice
            this.frameY * this.height, // y location of slice
            this.width, // how wide our slice is
            this.height, // how tall our slice is 
            this.x, // where we'll draw this sprite
            this.y,
            this.width, // how wide the sprite will be drawn
            this.height, // how tall the sprite will be drawn
        )        
        // Include sprite animation in the draw function because draw func occurs each frame
        // NOTE, we're not moving the character here, just animating its sprite
        if (this.frameX < 3){
            this.frameX++;
        }else{
            this.frameX = 0;
        }
    }
    update(){
        // Moving the trooper
        if (this.x > 0){
            this.x -= this.speed
        }
        if (collide(this, player) && this.canInteract){
            this.speed = 0;
            troopersStopped++
            this.canInteract = false            
            this.width *= 0.01;
            this.height *= 0.01;
            
        }
    }
}

for (let i = 0; i < howManyVillains; i++){
    villains.push(new BadGuy());
}

// Initialize our player sprite image and set the file path to the sprite sheet
const playerSprite = new Image();
playerSprite.src = "/static/games/star_wars_mando/mandalorian2.png";

// Background details
const background = new Image();
background.src = "{% static '/games/star_wars_mando/background.png' %}" // I have to download the image he made in photoshop (or get my own)


// ANIMATION FUNCTIONS
/* 
A couple points here:
He could've used built-in 'drawImage()' instead of a custom function, but he said the custom function
allows you to pass in more arguments if you wanted to (even though we're not right now).
This function includes the full, 9-argument usage of drawImage;
all the 's' args are 'source' - i.e. where to start and finish the slice on the sprite sheet;
all the 'd' args are 'draw' - i.e. where and how big you'll draw the slice on your canvas
*/
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH){
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}


// CONTROLS
/* Key Names:
ArrowRight, ArrowLeft, ArrowUp, ArrowDown;
Space
*/
window.addEventListener('keydown', function(e){
    // This is a way of adding things into our currently-empty key array;
    // It means: each time a key is pressed, it's added to the array.
    keys[e.code] = true;
    console.log(keys);
    player.moving = true;
})
window.addEventListener('keyup', function(e){
    delete keys[e.code];
    player.moving = false;
})

// Adding the line 'player.moving = true' prevents some glitchy stops to the player's
// movement, which occur when two buttons are pressed at once (up and right, for example)
function movePlayer(){
    if (keys['ArrowUp'] && player.y > 100){
        player.frameY = 3 // so he's facing up
        player.y -= player.speed; // now add 'movePlayer()' to our animate() loop
        player.moving = true;
    }
    if (keys['ArrowLeft'] && player.x > 0){
        player.frameY = 1 // so he's facing left
        player.x -= player.speed; 
        player.moving = true;
    }
    if (keys['ArrowRight'] && player.x < canvas.width - player.width){
        player.frameY = 2 // so he's facing right
        player.x += player.speed; 
        player.moving = true;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height){
        player.frameY = 0 // so he's facing down
        player.y += player.speed; 
        player.moving = true;
    }
}

// Cycles through the frames of sprite animation
function handlePlayerFrame(){
    if (player.frameX < 3 && player.moving) player.frameX++
    else player.frameX = 0;
}


/* COMMENTING OUT THIS WHOLE FUNCTION TO FIX THE FRAME RATE, WHICH WAS TOO FAST */
// This function includes a shorter, 5-argument usage of drawImage
/*
function animate(){
    // It's odd to 'animate' a static background, but it's because it gets redrawn in each frame.
    // This command takes 5 args: 
    // 1) What to draw; 2&3) X/Y coord of drawing origin; 3&4) width and height of drawing 
    ctx.drawImage(background, 0,0, canvas.width,canvas.height);
    drawSprite(
        playerSprite, // what to draw
        player.width * player.frameX, // x coord of start of slice 
        player.height * player.frameY, // y coord of start of slice
        player.width, // width of slice
        player.height, // height of slice
        player.x,
        player.y,
        player.width,
        player.height,    
    )
    movePlayer();
    handlePlayerFrame();
    requestAnimationFrame(animate); // recursive way of continuously drawing the background in each frame of animation
};*/
/*======
Big Side Note: 
If you wanted the background to move/scroll, you could define a variable outside the function:
let position = 0;
Then inside the function, instead of "(background, 0,0,..)", you could do "(background, position, 0,...)",
THEN... add a "position++", to increment the x position with each frame of animation.
That'll give it a 'trail' behind it, but to eliminate that you could add this line:
ctx.clearRect(0,0, canvas.width, canvas.height);
Cool. 
======*/

// Call our new function!
// animate();

// Function to return a boolean for whether two objects collided
function collide(first, second){
    return (Math.abs(first.x - second.x) < first.width/2 &&
        Math.abs(first.y - second.y) < first.height/2)
}

// Make some variables with no values yet:
let fps, fpsInterval, startTime, now, then, elapsed;

function startAnimating(fps){
    fpsInterval = 1000/fps; // how long between frames
    then = Date.now(); // built-in JS function that returns the number of milliseconds elapsed since 1970! haha
    startTime = then;
    animate();
}

function animate(){
    requestAnimationFrame(animate);
    now = Date.now();
    elapsed = now - then;
    if (elapsed > fpsInterval){
        then = now - (elapsed % fpsInterval);
        // Section of code from our OLD animate() function:
        ctx.clearRect(0,0,canvas.width, canvas.height); // not exactly sure if needed
        //ctx.drawImage(background, 0,0, canvas.width,canvas.height);
        ctx.fillText('Droids Saved: ' + savedDroids, canvas.width - 200, 30);
        ctx.fillText('Troopers Stopped: ' + troopersStopped, canvas.width - 200, 70);

        // Win Lose or Draw:
        // Losing condition if you don't save at least 10 droids
        if (goodGuys.length === 0 && savedDroids < 10) {
            gameOver = true;
        }
        // Winning condition if you save 10 or more droids
        if (goodGuys.length === 0 && savedDroids >= 10) {
            youWin = true;
        }
        // Game Over Screen OR Win Screen
        if (gameOver) {
            ctx.fillText("GAME OVER", canvas.width/2 - 50, canvas.height/2);
        }else if (youWin){
            ctx.fillText("You saved " + savedDroids + " droids!", canvas.width/2 - 100, canvas.height/2);
        // If you didn't win or lose, keep playing
        }else{
            drawSprite(
                playerSprite, // what to draw
                player.width * player.frameX, // x coord of start of slice 
                player.height * player.frameY, // y coord of start of slice
                player.width, // width of slice
                player.height, // height of slice
                player.x,
                player.y,
                player.width,
                player.height,    
            );
    
            for  (let i=0; i < goodGuys.length; i++){
                goodGuys[i].draw();
                goodGuys[i].update();
            }
    
            for (let i=0; i < villains.length; i++){
                villains[i].draw();
                villains[i].update();
                // if (collide(player, villains[i])){
                //     villains.splice(villains[i], 1);
                //     troopersStopped++
                // }
                // for (let j = 0; goodGuys.length; j++){
                //     if (collide(villains[i], goodGuys[j])){
                //         goodGuys.splice(goodGuys[j], 1);
                //     }
                // }
            }
            movePlayer();
            handlePlayerFrame();
        }


    }
}

startAnimating(10);
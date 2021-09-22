// At the end, he went back and added these lines up top for the player state
let currentState = 'run';
// Since we added id='animations' to the 'select' element in our html, we can
// now grab it like so...
const dropdown = document.getElementById('animations');
// The event listener will listen for changes to the dropdown
// Upon detecting a change, the html value of the selection will be
// saved as 'currentState'.
// Note the e.target.value syntax .. that's all new and mysterious to me, but the idea makes sense.
dropdown.addEventListener('change', function(e){
    currentState = e.target.value;
});

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const CANVAS_WIDTH = canvas.width = 600; // same width as in the CSS 
const CANVAS_HEIGHT = canvas.height = 600; // same height as in the CSS 

const playerImage = new Image();
playerImage.src = '../../static/games/spriteAnimation/shadow_dog.png';
// Sprite Sheet Dimensions: 6876 wide x 5230 high
const spriteWidth = 575; //  6876/12 (He adjusted from 573 to 575 because the frames were slightly off)
const spriteHeight = 523; //  5230/10

// Replacing these with more dynamic code
// let whichFrameX = 0;
// let whichFrameY = 0;

let gameFrame = 0; // going to use this to help modify the frame rate; you'll see
let staggerFrames = 5; // use in conjunction with gameFrame to control frame rate

// The purpose of this whole section is to dynamically code the x/y frames. Otherwise, you have
// to keep changing how many frames of animation are associated with each type of animation...
// e.g. idle has 7 frames, but sitting has 5 frames.
// This is some practice with data structures. I think.
const spriteAnimations = [];
const animationStates = [
    {
        name: 'idle',
        frames: 7,
    },
    {
        name: 'jump',
        frames: 7,
    },
    {
        name: 'fall',
        frames: 7,
    },
    {
        name: 'run',
        frames: 8, // actually 9 frames, but the last frame just duplicates the first, which makes it look choppy
    },
    {
        name: 'dizzy',
        frames: 11,
    },
    {
        name: 'lieDown',
        frames: 5,
    },
    {
        name: 'roll',
        frames: 7,
    },
    {
        name: 'bite',
        frames: 7,
    },
    {
        name: 'updog',
        frames: 12,
    },
    {
        name: 'tired',
        frames: 4,
    },
];

// This gets crazy for the beginner brain. I'll do my best to walk myself through this.
// For each animation state I defined above...
animationStates.forEach((state, index) => {
    // ...'frames' is going to be an object 'loc' with an empty array
    // IMPORTANT: I think this instance of 'frames' is different from the object attributes above having the same name
    // i.e. this is 'frames', as opposed to 'state.frames'. 
    let frames = {
        loc: [],
    }
    // Now we're going identify all the x and y positions for each state of animation...
    // e.g. if state is 'jump', then state.frames=7, as defined above;
    // and that iteration of the for loop would be from 0 to 6...
    // Continuing to use 'jump' as our example:
    for (let j =0; j < state.frames; j++){
        let positionX = j * spriteWidth; // (0 thru 6) * spriteWidth
        let positionY = index * spriteHeight; // index of state 'jump' is 1
        // Each of the resulting x/y positions created above will be pushed to our 'loc' array in 'frames'
        frames.loc.push({x: positionX, y: positionY});
    }
    // So now we're populating 'spriteAnimations' array with objects:
    // In this 'jump' example, state.name is 'jump', and 'frames' is all the animation frames for 'jump'
    spriteAnimations[state.name] = frames;
    // Logging this shows that we now have {jump: [array of XY positions for each frame of jump animation]}...
    // but since this is a forEach(), all of the states will be respresented with their associated animation arrays.
    console.log(spriteAnimations)
});


function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Using this to only animate the sprite every 5th frame of game animation
    // Math.floor() removes the decimals, and then the % 6 will ensure the value of 'position'
    // fluctuates between 0 and 5.
    // Before long, we'll probably replace the hard-coded 6 with a variable corresponding to different animation types (jump, sit, etc)
    // ... yep, here we go. The 6 is gone
    let position = Math.floor(gameFrame/staggerFrames) % spriteAnimations[currentState].loc.length;

    let whichFrameX = spriteWidth * position;
    let whichFrameY = spriteAnimations[currentState].loc[position].y;

    // The 9-argument usage of drawImage(): 's' is source and 'd' is destination
    // drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
    ctx.drawImage(playerImage, 
        whichFrameX, 
        whichFrameY, 
        spriteWidth, 
        spriteHeight, 
        0, 
        0, 
        spriteWidth, 
        spriteHeight,
    );

    gameFrame++;
    requestAnimationFrame(animate);
};

animate();
// BASED ON CODE-ALONG WITH FRANK'S LABORATORY ON YOUTUBE
// "JavaScript Game for Beginners: Parallax Scrolling"
// Check out bevouliin.com for more 2d artwork - this lesson uses images from there

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// Global constants for canvas dimensions (which match the CSS dimensions)
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

// This variable will determine the scroll rate of the background
let gameSpeed = 4;

const backgroundLayer1 = new Image();
backgroundLayer1.src = '../../static/games/spriteAnimation/parallaxImages/layer-1.png';
const backgroundLayer2 = new Image();
backgroundLayer2.src = '../../static/games/spriteAnimation/parallaxImages/layer-2.png';
const backgroundLayer3 = new Image();
backgroundLayer3.src = '../../static/games/spriteAnimation/parallaxImages/layer-3.png';
const backgroundLayer4 = new Image();
backgroundLayer4.src = '../../static/games/spriteAnimation/parallaxImages/layer-4.png';
const backgroundLayer5 = new Image();
backgroundLayer5.src = '../../static/games/spriteAnimation/parallaxImages/layer-5.png';

// JS interacting with the HTML slider bar
const slider = document.getElementById('slider');
slider.value = gameSpeed;
const showGameSpeed = document.getElementById('showGameSpeed');
showGameSpeed.innerHTML = gameSpeed;
slider.addEventListener('change', function(e){
    console.log(e.target.value);
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = gameSpeed;
})

class Layer {
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.x2 = this.width; // where the second image starts
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * speedModifier;
    }
    update(){
        // The repetition of this line is a bit confusing right now
        this.speed = gameSpeed * this.speedModifier;

        // If a background image has scrolled completely off the screen
        if (this.x <= -this.width){
            // ...then the new x position is going to be on the other side of the screen...
            // PLUS the current x2 value (nearly 0), MINUS speed to account for one frame of animation
            this.x = this.width + this.x2 - this.speed;
        }
        // Now do the same thing for the second image (associated with x2)
        if (this.x2 <= -this.width){
            this.x2 = this.width + this.x - this.speed;
        }

        // Otherwise (if a background image has not completely scrolled off-screen)
        this.x = Math.floor(this.x - this.speed);
        this.x2 = Math.floor(this.x2 - this.speed);
    }
    draw(){
        // We draw this image twice; one at each x location, to allow seemless scrolling
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x2, this.y, this.width, this.height);
    }
}

const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.6);
const layer4 = new Layer(backgroundLayer4, 0.7);
const layer5 = new Layer(backgroundLayer5, 1.0);

const gameObjects = [layer1, layer2, layer3, layer4, layer5];

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    })
    requestAnimationFrame(animate);
};
animate();
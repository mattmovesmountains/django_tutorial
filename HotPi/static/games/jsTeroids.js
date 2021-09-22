const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

let gameOver = false;
let score = 0;

class Player{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0, // start angle
            Math.PI * 2, // 360 in radians
            false, // boolean for clockwise or ccw; doesn't matter in a circle
        );
        ctx.fillStyle = this.color // passes in 'blue' from the const player below
        ctx.fill(); // the command that draws it (once .draw() is called)
    }
}

class Projectile{
    // Similar constructor to Player, BUT it adds a velocity component
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0, // start angle
            Math.PI * 2, // end angle for circle
            false,
        );
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

// Starting with a copy of the class info for Projectile
class Enemy{
    constructor(x, y, radius, color, velocity){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(
            this.x,
            this.y,
            this.radius,
            0, // start angle
            Math.PI * 2, // end angle for circle
            false,
        );
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update() {
        this.draw() // actually calls the above-made draw() function in our update() function. Cool
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

/* DOCUMENTING ISSUES WITH THE BACKGROUND */
/** Well, I tried a bunch of things, but I haven't gotten the background to render.
 * What's interesting is that it works fine as a standalone project, but now that it's
 * in Django, it's giving me trouble. I tried serving the background as a static file;
 * I tried pulling a file from the internet; I tried to forego the background image altogether,
 * and just modify the CSS to have a background color ( and actually, that KINDA worked, but only
 * in FireFox, and then that browser crashed 'cause it can't hang.)
 * 
 * It seems like the Chromium browser doesn't communicate properly with Django each time I 
 * update/save a file because the changes don't seem to be reflected.
 */

// Background details
const background = new Image();
//background.src = '{% static "games/zackground.jpeg" %}'
background.src = 'https://wp-assets.futurism.com/2014/12/seahorse-nebula.jpg'
console.log(background)


const playerX = canvas.width /2;
const playerY = canvas.height /2;

const player = new Player(playerX, playerY, 30, 'rgb(50,50,255)');
player.draw();

const projectile = new Projectile(
    // You want the projectiles to spawn at the center of the player, which is the center of the canvas
    canvas.width / 2,
    canvas.height / 2, 
    5,
    'red',
    // Making velocity an object with x and y components
    {
        x: 1,
        y: 1,
    }
);


const projectiles = []; // array to which we'll add instance of Projectile class objects
const enemies = [];

function spawnEnemies() {
    // Set the interval between spawning of a new enemy
    // This is sort of an override to the frame rate of the animation function
    // Local scope constants are used to create enemy parameters, and an enemy is
    // created and pushed to the array every 1000 milliseconds.
    setInterval(() => {
        // To spawn enemies at random locations:
        const radius = (Math.random()*25) + 5; // random radius between 5 and 30(?) or 25?
        /* Ternary operator:
            The '?' and ':' are used 
            (someCondition) ? (resultsInThis) : (otherwiseDoThis) 
        */
        // Generate a random y value that is between 1 and 2 times the canvas height
        const y = Math.random() * (canvas.height*2) - canvas.height/2;
        var buffer = 0; // you'll see
        // If y 25% more or less than the top/bottom of the canvas, 
        if (y > 1.25 * canvas.height || y < -0.25 * canvas.height) {
            // ...then we're going to set this buffer to add a random value to our x
            // which will be between 1/4 and 3/4 of the width of the canvas.
            buffer = Math.random()*(canvas.width/2) + (0.25*canvas.width)
        }
        const x = Math.random() < 0.5 ? 0 - radius + buffer : canvas.width + radius - buffer;

        let r = Math.random()*255 + 50;
        let g = Math.random()*255 + 50;
        let b = Math.random()*255 + 50;
        const color = 'rgb('+r+','+g+','+b+')';
        //const color = 'rgb((Math.random()*255 + 50),(Math.random()*255 + 50),(Math.random()*255 + 50))';

        // atan2 using Opposite over Adjacent sides to calculate the angle between a horizontal
        // line passing through the center of 'player', and the line connecting 'player' and a spawned enemy (in radians).
        const angle = Math.atan2(
            canvas.height / 2 - y,
            canvas.width / 2 - x,
        )
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle),
        }
        enemies.push(new Enemy(x,y,radius,color,velocity));        
    }, 1000)
}


// First line of this function is recursive to make an animation loop
function animate(){
    requestAnimationFrame(animate);
    // Clearing at each frame makes the projectiles shoot as dots, rather than ever-growing lines
    // because it will remove the trail, and only draw the current position
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.drawImage(background2, 0, 0, canvas.width, canvas.height);
    // Do all this as long as it's not GAMEOVER
    if (!gameOver) {
        ctx.font = '20px monospace';
        ctx.fillText('Score: ' + score, canvas.width - 200, 30)
        if (player.radius > 0){
            player.draw();
        }

        projectiles.forEach((projectile) => {
            projectile.update();
            projectile.draw()
        })

        enemies.forEach((enemy, index) => {
            // Notice I didn't call draw() and update() because I added 'this.draw()'
            // into the Enemy update() function. So calling update() automatically calls draw().
            enemy.update();

            // Set up ENEMY / PROJECTILE collision
            projectiles.forEach((projectile, projectileIndex) => {
                const dist = Math.hypot(
                    enemy.x - projectile.x,
                    enemy.y - projectile.y,
                )
                // If projectile hits enemy, remove both
                if (dist - enemy.radius - projectile.radius < 1) {
                    enemies.splice(index, 1);
                    score ++;
                    projectiles.splice(projectileIndex, 1);
                }
            })

            // Set up ENEMY / PLAYER collision
            const playerDist = Math.hypot(
                enemy.x - player.x,
                enemy.y - player.y,
            )
            
            // If enemy hits player, reduce player size
            if (playerDist - enemy.radius - player.radius < 1) {
                enemies.splice(index, 1);
                player.radius -= 5;
                if (player.radius < 5){
                    player.radius = 0;
                    ctx.font = '50px arial';
                    gameOver = true;
                }
            }
        })
    }else{
        ctx.fillStyle = '255,50,50'
        ctx.fillText("GAME OVER", canvas.width/2 - 150, canvas.height/2)
    }
}

// Mechanics of shooting projectiles upon mouse click
addEventListener('click', (e) => {
    // Calc the angle formed by the point that was clicked,
    //      the center of the player,
    //      and the x-axis:
    const angle = Math.atan2(
        e.clientY - canvas.height / 2, // the Opposite/Y side of the triangle
        e.clientX - canvas.width / 2, // the Adjacent/X side of the triangle
    )

    // Based on a given angle, sin and cos will return the appropriate
    // ratio of x/y so that the projectile points toward the mouse click location
    const velocity = {
        x: Math.cos(angle), 
        y: Math.sin(angle),
    }

    // Add new Projectile instance each time there's a click
    projectiles.push(new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5,
        'red',
        {
            x: velocity.x,
            y: velocity.y,
        }
    ))
    // projectile.draw();
    // projectile.update();
})

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
})

animate();
spawnEnemies();


/* NOTES ABOUT THE MATH USED 
JS seems to output radians;
radians * (180/pi) = degrees;
Math.atan2() takes 2 args, y and x, and returns the angle in radians
*/

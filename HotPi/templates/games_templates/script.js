
// options
// const k = kaboom({
//     global: true, // import all kaboom functions to global namespace
//     width: 640, // width of canvas
//     height: 480, // height of canvas
//     canvas: document.getElementById("game"), // use custom canvas
//     scale: 2, // pixel size (for pixelated games you might want smaller size with scale)
//     clearColor: [0, 0, 1, 1], // background color (default is a checker board background)
//     fullscreen: true, // if fullscreen
//     crisp: true, // if pixel crisp (for sharp pixelated games)
//     debug: false, // debug mode
//     plugins: [ asepritePlugin, ], // load plugins
// });

kaboom({
    global = true,
    width: 640,
    height: 480,
})

scene('main', () => {
    add([
        text('testing!', 32),
        origin('center'),
        pos(width()/2, height()/2)
    ])
})

start('main')
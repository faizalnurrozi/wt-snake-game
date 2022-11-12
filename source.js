var Game = Game || {};
var Component = Component || {};

var objectSize = 20;
var coorX = coorY = 0;
var snakeX = snakeY = objectSize;
var foodX = foodY = 15;
var tail = 5;
var trail = [];
var score = 0;
var levelMapping = [
    { level: 1, min: 0, max: 30 },
    { level: 2, min: 31, max: 60 },
    { level: 3, min: 61, max: 90 },
    { level: 4, min: 91, max: 120 },
];
var level = 1;
var stateKeyCode = null;

function keyPress(event) {
    console.log(stateKeyCode, event.keyCode);
    if (event.keyCode === 37 && stateKeyCode !== 39) {
        stateKeyCode = event.keyCode;
        coorX = -1;
        coorY = 0;
    } else if (event.keyCode === 39 && stateKeyCode !== 37) {
        stateKeyCode = event.keyCode;
        coorX = 1;
        coorY = 0;
    } else if (event.keyCode === 38 && stateKeyCode !== 40) {
        stateKeyCode = event.keyCode;
        coorX = 0;
        coorY = -1;
    } else if (event.keyCode === 40 && stateKeyCode !== 38) {
        stateKeyCode = event.keyCode;
        coorX = 0;
        coorY = 1;
    }
}

Component.Canvas = function (element) {
    var canvas = document.getElementById(element);
    var context = canvas.getContext('2d');
    return { canvas, context };
};

Component.Stage = function (element) {
    var { canvas, context } = new Component.Canvas(element);

    /**
     * Object move
     */

    snakeX += coorX;
    snakeY += coorY;

    if (snakeX < 0) snakeX = objectSize - 1;
    if (snakeX > objectSize - 1) snakeX = 0;
    if (snakeY < 0) snakeY = objectSize - 1;
    if (snakeY > objectSize - 1) snakeY = 0;

    /**
     * Draw canvas to black
     */

    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    /**
     * Draw object snake
     */

    context.fillStyle = 'lime';
    for (i = 0; i < trail.length; i++) {
        context.fillRect(trail[i].x * objectSize, trail[i].y * objectSize, objectSize - 2, objectSize - 2);
    }
    trail.push({ x: snakeX, y: snakeY });


    if (trail.length > tail) {
        trail.shift();
    }

    /**
     * Draw object food
     */

    context.fillStyle = 'red';
    if (snakeX == foodX && snakeY == foodY) {

        // Increase snake
        tail++;

        // Scoring
        score += 10;
        document.querySelector('.score').innerHTML = score;

        // Initiate new food coordinate
        foodX = Math.floor(Math.random() * objectSize);
        foodY = Math.floor(Math.random() * objectSize);
    }
    context.fillRect(foodX * objectSize, foodY * objectSize, objectSize - 2, objectSize - 2);

    // Leveling
    levelMapping.forEach(elm => {
        if (score >= elm.min && score <= elm.max) {
            level = elm.level;
        }
    });
    document.querySelector('.level').innerHTML = level;
};

Game.Snake = function (element) {
    document.onkeydown = keyPress;
    setInterval(function () {
        new Component.Stage(element);
    }, 1000 / 15);
};

window.onload = function () {
    new Game.Snake('stage');
};
var connection = new signalR.HubConnectionBuilder()
    .withUrl("/gameHub")
    .build();

var gameframe;

connection.on("updateFrame", function (frame) {
    // Handle the frame object here
    gameframe = frame;
    render(frame);
});

connection.start().catch(function (err) {
    return console.error(err.toString());
});

// Load images
const shipImg = new Image();
shipImg.src = 'ship.png';
const asteroidImg = new Image();
asteroidImg.src = 'asteroid.png';
const bulletImg = new Image();
bulletImg.src = 'bullet.png';
const explosionImg = new Image();
explosionImg.src = 'explosion_1.png';
const backgroundImg = new Image();
backgroundImg.src = 'background.png';

// Get canvas and context
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// Draw background
function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

// Draw game objects
function drawObjects(frame) {
    frame.asteroids.forEach(a => ctx.drawImage(asteroidImg, a.x, a.y, a.size, a.size));
    frame.bullets.forEach(b => ctx.drawImage(bulletImg, b.x, b.y, 10, 10));
    frame.explosions.forEach(e => ctx.drawImage(explosionImg, e.x, e.y, 50, 50));
    frame.players.forEach(p => {
        ctx.globalAlpha = p.isDead ? 0.5 : 1;
        ctx.drawImage(shipImg, p.x, p.y, p.size, p.size);
        ctx.fillStyle = p.isDead ? 'red' : 'white';
        ctx.fillText(p.name, p.x, p.y + p.size + 10);
    });
    ctx.globalAlpha = 1;
}

// Draw scoreboard
function drawScoreboard(frame) {
    const scoreboard = document.getElementById('scoreboard');
    scoreboard.innerHTML = frame.players.map(p => `${p.name}: ${p.score}`).join('<br>');
}

// Render frame
function renderFrame(frame) {
    drawBackground();
    drawObjects(frame);
    drawScoreboard(frame);
}
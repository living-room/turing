// we can specify our own canvas between the single quotes
const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, "", { preload: preload, create: create, update: update, render: render }, false, false);

// Object that provides a pool of particle emitters 
// and two emission modes: explode (high power) and spew (low power)
const bananaEmitter = {
	pool: [],
	cycle: 0,
	explode: function(whereX, whereY, angle) {
		this.cycle = this.cycle > 19 ? 0 : this.cycle;
		this.pool[this.cycle].x = whereX;
		this.pool[this.cycle].y = whereY;
		const xSpeed = Math.cos(game.math.reverseAngle(angle)) * 100;
		const ySpeed = Math.sin(game.math.reverseAngle(angle)) * 100;
		this.pool[this.cycle].setXSpeed(xSpeed, xSpeed + (xSpeed * .5));
		this.pool[this.cycle].setYSpeed(-ySpeed, ySpeed);
	   	this.pool[this.cycle].start(true, 2000, null, 2, 2);
		this.cycle += 1;
		},
	spew: function(whereX, whereY, angle) {
		this.cycle = this.cycle > 19 ? 0 : this.cycle;
		this.pool[this.cycle].x = whereX;
		this.pool[this.cycle].y = whereY;
		const xSpeed = Math.cos(game.math.reverseAngle(angle)) * 60;
		const ySpeed = Math.sin(game.math.reverseAngle(angle)) * 60;
		this.pool[this.cycle].setXSpeed(xSpeed, xSpeed + (xSpeed * .5));
		this.pool[this.cycle].setYSpeed(-ySpeed, ySpeed);
	   	this.pool[this.cycle].start(true, 1000, null, 1, 1);
		this.cycle += 1;
	}
};

// Phaser life cycle preload function
function preload() {
	game.load.image("redParticle", "sprite/redParticle.png");
}

// Phaser life cycle create function
function create() {
	game.stage.backgroundColor = 0xffffff;
	for (let i = 0; i < 20; i += 1) {
		bananaEmitter.pool[i] = game.add.emitter(game, 0, 0, 2);
		bananaEmitter.pool[i].makeParticles("redParticle");
	}
}

// Phaser life cycle update function
function update() {

}

// Phaser life cycle render function
function render() {

}

// Call this function to make particles!
function doParticles(x, y, angle) {
	bananaEmitter.explode(x, y, angle);
}

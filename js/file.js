var tileSize = 32;
var tweenTime = 250;
var backgroundX = 0;
var backgroundY = 0;
File.prototype = Object.create(Phaser.Sprite.prototype);

File.prototype.constructor = File;

function File(game, x, y) {
	console.log("constructing file object")
    Phaser.Sprite.call(this, game, x, y, 'file');
    console.log("sprite called")
    game.add.existing(this);
    this.destination = null;
}

File.prototype.moveUp = function(x, y) {
	console.log("move up");
	//x and y, the parameters, are where the file should move
    var tween = this.game.add.tween(this).to({ x: x * tileSize + backgroundX, y: y * tileSize + backgroundY}, 
    											tweenTime, Phaser.Easing.Linear.None, true);
}



var tileSize = 32;
var tweenTime = 250;
var backgroundX = 0;
var backgroundY = 0;
File.prototype = Object.create(Phaser.Sprite.prototype);

File.prototype.constructor = File;

function File(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'file');
    game.add.existing(this);
    this.destination = null;
}

Door.prototype.moveUp = function(x, y) {
	console.log("move up");
    var tween = this.game.add.tween(this).to({ x: x * tileSize + backgroundX, y: y * tileSize + backgroundY}, 
    											tweenTime, Phaser.Easing.Linear.None, true);
}



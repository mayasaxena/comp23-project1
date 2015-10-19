File.prototype = Object.create(Phaser.Sprite.prototype);

File.prototype.constructor = File;

function File(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'file');
    game.add.existing(this);
    this.destination = null;
}


Door.prototype.moveUp = function() {
	//MAYA HELP
}



Door.prototype = Object.create(Phaser.Sprite.prototype);

Door.prototype.constructor = Door;

var open_animation;
var doorFrameRate = 10;

function Door(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'door_animation');
    game.add.existing(this);
    this.animations.add('door_animation');
}

Door.prototype.open = function() {
    open_animation = this.animations.play('door_animation', doorFrameRate);
}

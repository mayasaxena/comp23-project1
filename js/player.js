var tileSize = 32;
var tweenTime = 250;
var backgroundX = 0;
var backgroundY = 0;
var size = { x: 32, y: 32 };
var stateChangeDelay = 500;

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.constructor = Player;

function Player(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'player');
    this.game.add.existing(this);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.destination = null;
}

Player.prototype.update = function() {
    this.xCoord = Math.floor(((this.x + tileSize / 2) - backgroundX) / tileSize);
    this.yCoord = Math.floor(((this.y + tileSize / 2) - backgroundY) / tileSize);

    // Set movement intention based on input.
    this.moveIntention = null; // clear old move input

    if (this.cursors.left.isDown) {
        this.moveIntention = moveType.LEFT;
    } else if (this.cursors.right.isDown) {
        this.moveIntention = moveType.RIGHT;
    } else if (this.cursors.up.isDown) {      
        this.moveIntention = moveType.UP;
    } else if (this.cursors.down.isDown) {     
        this.moveIntention = moveType.DOWN;
    }

    if (!this.isSnapping) {
        if(this.isMoving() && this.justReachedDestination() && !this.moveIntention) {
            this.stopMoving();
        }
        // Stop the moving entity when it hits a wall.
        else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                !this.canMoveDirectionFromCurrentTile(this.moveIntention)) {
            this.stopMoving();
        }
        // Destination reached, but set new destination and keep going.
        else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                this.canMoveDirectionFromCurrentTile(this.moveIntention) &&
                this.moveIntention === this.lastMove) {
            this.continueMovingFromDestination();
        }
        // Destination reached, but changing direction and continuing.
        else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                this.canMoveDirectionFromCurrentTile(this.moveIntention) &&
                this.moveIntention !== this.lastMove) {
            this.changeDirectionAndContinueMoving(this.moveIntention);
        }
        // Not moving, but wanting to, so start!
        else if(!this.isMoving() && this.moveIntention &&
                this.canMoveDirectionFromCurrentTile(this.moveIntention)) {
            this.startMoving(this.moveIntention);
        }
    }
}

Player.prototype.getCurrentTile = function() {
    return { x: this.xCoord, y: this.yCoord };
}

Player.prototype.getTileAdjacentToTile = function(tileX, tileY, direction) {
    if (direction === moveType.UP) {
        tileY += -1;
    } else if(direction === moveType.DOWN) {
        tileY += 1;
    } else if(direction === moveType.LEFT) {
        tileX += -1;
    } else if(direction === moveType.RIGHT) {
        tileX += 1;
    } 
    return { x: tileX, y: tileY };
}

Player.prototype.startMoving = function(direction) {
    var currTile = this.getCurrentTile();
    this.destination = this.getTileAdjacentToTile(currTile.x, currTile.y, direction);
    this.lastMove = direction;
}

Player.prototype.continueMovingFromDestination = function() {
    this.snapToTile(this.destination.x, this.destination.y);
    this.destination = null;
}

Player.prototype.changeDirectionAndContinueMoving = function(newDirection) {
    this.snapToTile(this.destination.x, this.destination.y);
    this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, newDirection);
    this.lastMove = newDirection;
}

Player.prototype.stopMoving = function() {
    this.snapToTile(this.destination.x, this.destination.y);
    this.destination = null;
}

Player.prototype.snapToTile = function(x, y) {
    this.isSnapping = true;
    var tween = this.game.add.tween(this).to({ x: x * tileSize + backgroundX, 
                                                      y: y * tileSize + backgroundY}, 
                                                      tweenTime, 
                                                      Phaser.Easing.Linear.None, 
                                                      true);
    tween.onComplete.add(this.stopSnap, this);
}

Player.prototype.justReachedDestination = function() {
    var result = (
        (this.xCoord == this.destination.x) || 
        (this.yCoord == this.destination.y)
    );
    return result;
}

Player.prototype.isMoving = function() {
    return this.destination !== null;
}

Player.prototype.canMoveDirectionFromCurrentTile = function(direction) {
    var currTile = this.getCurrentTile();
    var newPos = this.getTileAdjacentToTile(currTile.x, currTile.y, direction);
    var tile = (this.map.getTile(newPos.x, newPos.y, this.obstacles));
    if (tile) {
        if (tile.index == 2) {
            this.handleDoor(newPos.x, newPos.y);
            return false;
        }
        return (this.map.collideIndexes.indexOf(tile.index) == -1);
    } else {
        return true;
    }
}

Player.prototype.stopSnap = function() {
    this.isSnapping = false;
}

Player.prototype.handleDoor = function(doorX, doorY) {}

Player.prototype.map = null;
Player.prototype.obstacles = null;


Player.prototype.goThroughDoor = function(x, y, state) {
    var tween = this.game.add.tween(this).to({ x: x * tileSize + backgroundX, 
                                                      y: y * tileSize + backgroundY}, 
                                                      tweenTime, 
                                                      Phaser.Easing.Linear.None, 
                                                      true);
    tween.onComplete.add(function() {
        this.game.time.events.add(stateChangeDelay, function() {
            this.game.state.start(state);
        }, this);
    }, this);
}

var moveType = {
    'UP': 1,
    'DOWN': 2,
    'LEFT': 4,
    'RIGHT': 8
};
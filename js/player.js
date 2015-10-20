var tileSize = 32;
var tweenTime = 490;
var size = { x: 32, y: 32 };
var stateChangeDelay = 500;
var doorIndex = 2;
var doorwayIndex = 10;
var matIndex = 22;
var edgeIndex = 1;
var fileIndex = 17;
var frameRate = 7;


Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.constructor = Player;

function Player(game, x, y, facing) {
    Phaser.Sprite.call(this, game, x, y, 'walk', facing);
    this.game.add.existing(this);
    this.animations.add("front", [1, 0, 2, 0]);
    this.animations.add("back", [4, 3, 5, 3]);
    this.animations.add("left", [7, 6, 8, 6]);
    this.animations.add("right", [10, 9, 11, 9]);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.destination = null;

    this.currAnimation = null;
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
    
    if (y < this.yCoord) {
        this.currAnimation = this.animations.play("back", frameRate, true);
    } else if (y > this.yCoord) {
        this.currAnimation = this.animations.play("front", frameRate, true);
    } else if (x < this.xCoord) {
        this.currAnimation = this.animations.play("left", frameRate, true);
    } else if (x > this.xCoord) {
        this.currAnimation = this.animations.play("right", frameRate, true);
    }
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
        if (tile.index == doorIndex) {
            this.handleDoor(newPos.x, newPos.y, true);
            return false;
        } else if (tile.index == doorwayIndex) {
            this.handleDoor(newPos.x, newPos.y, true, true);
            return false;    
        } else if (tile.index == matIndex) {
            this.handleDoor(newPos.x, newPos.y, false);
            return false;
        } else if (tile.index == fileIndex){
            console.log("on file");
            //newPos is a file, so that becomes the current tile 
            return this.canFileMoveDirection(newPos, direction);
        }
        return (this.map.collideIndexes.indexOf(tile.index) == -1);
    }else {
        return true;
    }
}
Player.prototype.canFileMoveDirection = function(currTile, direction){
    //new Pos is the potential new position of the file
    var newPos = this.getTileAdjacentToTile(currTile.x, currTile.y, direction);
    var tile = (this.map.getTile(newPos.x, newPos.y, this.obstacles));
    //return (this.map.collideIndexes.indexOf(tile.index) == -1);
    if (tile) {
        //will look into uncomenting this section later
       /* if (tile.index == doorIndex) {
            this.handleDoor(newPos.x, newPos.y, true);
            console.log("door index");
            return false;
        }else if (tile.index == doorwayIndex) {
            this.handleDoor(newPos.x, newPos.y, true, true);
            console.log("doorway index");
            return false;    
        } else if (tile.index == matIndex) {
            console.log("mat index");
            this.handleDoor(newPos.x, newPos.y, false);
            return false;
        } else if (tile.index == fileIndex){
            console.log("on file");
            //newPos is a file, so that becomes the current tile 
            return this.canFileMoveDirection(newPos, direction);
        }*/
        return (this.map.collideIndexes.indexOf(tile.index) == -1);
    }else {
        this.moveFile(newPos, direction);
        return true;
    }
}

Player.prototype.moveFile = function(newPos, direction){
    //this is where we need to move the file image
    //file needs to move to newPos
}

Player.prototype.stopSnap = function() {
    this.isSnapping = false;
    if (this.currAnimation && !this.isMoving()) {
        this.currAnimation.stop();
        this.currAnimation.setFrame(3);
    } 
}

Player.prototype.handleDoor = function(doorX, doorY, goingIn, open) {}
Player.prototype.handleFile = function() {};
Player.prototype.map = null;
Player.prototype.obstacles = null;
Player.prototype.objects = null;

Player.prototype.goThroughDoor = function(x, y, state, goingIn, doorNum) {
    var facing;
    if (goingIn) {
        facing = moveType.UP;
    } else {
        facing = moveType.DOWN;
    }

    if (doorNum === undefined) {
        doorNum = -1;
    }

    localStorage.setItem(state + "DoorNum", JSON.stringify(doorNum));

    var data = {
            x: this.xCoord,
            y: this.yCoord,
            facing: facing,
    }
    localStorage.setItem(this.game.state.current, JSON.stringify(data));

    if (goingIn) {
        var doorPosString = x + "," + y;
        var openDoors = JSON.parse(localStorage.getItem(this.game.state.current + "Doors"));
        if (openDoors) {
            var pos = openDoors.indexOf(doorPosString);
            if (pos == -1) {
                openDoors.push(doorPosString);
            }
        } else {
            openDoors = [doorPosString];
        }
        localStorage.setItem(this.game.state.current + "Doors", JSON.stringify(openDoors));
    }
    if (y < this.yCoord) {
        this.currAnimation = this.animations.play("back", frameRate, true);
    } else if (y > this.yCoord) {
        this.currAnimation = this.animations.play("front", frameRate, true);
    } else if (x < this.xCoord) {
        this.currAnimation = this.animations.play("left", frameRate, true);
    } else if (x > this.xCoord) {
        this.currAnimation = this.animations.play("right", frameRate, true);
    }
    var move = this.game.add.tween(this).to({ x: x * tileSize + backgroundX, 
                                                      y: y * tileSize + backgroundY}, 
                                                      tweenTime, 
                                                      Phaser.Easing.Linear.None, 
                                                      true);
    var graphics = this.game.add.graphics(0, 0);
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, 1280, this.game.height);
    graphics.alpha = 0;
    graphics.endFill();
    
    var fadeOut = this.game.add.tween(graphics).to({ alpha: 1 }, 500);   
    move.chain(fadeOut);

    fadeOut.onComplete.add(function() {
        this.game.state.start(state);
    }, this);
}

Player.prototype.opposite = function(move) {
    if (move === moveType.UP) {
        return moveType.DOWN;
    } else if (move === moveType.DOWN) {
        return moveType.UP;
    } else if (move === moveType.LEFT) {
        return moveType.RIGHT;
    } else if (move === moveType.RIGHT) {
        return moveType.LEFT;
    }
}

var moveType = {
    'UP': 12,
    'DOWN': 3,
    'LEFT': 6,
    'RIGHT': 9
};

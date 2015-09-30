var tileSize = 32;
var tweenTime = 250;
var backgroundX = 0;
var backgroundY = 0;

function Level1Risky() {
    this.player;
    this.map;
    this.chairs;
    this.cursors;
    this.xCoord;
    this.yCoord;
    this.destination;
    this.size = { x: 32, y: 32 };
    this.moveIntention;
    this.isSnapping;
    this.obstacles;
};

Level1Risky.prototype = {
    preload: function() {
        console.log("Risky but Rewarding");
        this.game.load.image('chair', 'assets/images/risky_chair.png');
        this.game.load.image('tree', 'assets/images/risky_tree.png');
        this.game.load.image('player', 'assets/images/playersprite.png');

        this.game.load.tilemap('background', 'assets/tilemaps/maps/risky.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/risky_tileset.png');
    },

    create: function() {
        this.map = this.game.add.tilemap('background');
        this.map.addTilesetImage('risky_tileset', 'tiles');
    
        var floors = this.map.createLayer("Floor");
        var objects = this.map.createLayer("Objects");
        this.obstacles = this.map.createLayer("Collisions");

        this.map.setCollisionByExclusion([2], true, this.obstacles);
        this.map.setCollision(0, true, this.obstacles);

        this.player = this.game.add.sprite(0, tileSize * 2, 'player');
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.destination = null;
    },

    update: function() {

        this.game.physics.arcade.collide(this.player, this.obstacles);

        this.xCoord = Math.floor(((this.player.x + tileSize / 2) - backgroundX) / tileSize);
        this.yCoord = Math.floor(((this.player.y + tileSize / 2) - backgroundY) / tileSize);

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
                    !this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention)) {
                this.stopMoving();
            }
            // Destination reached, but set new destination and keep going.
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                    this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention) &&
                    this.moveIntention === this.lastMove) {
                this.continueMovingFromDestination();
            }
            // Destination reached, but changing direction and continuing.
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                    this.canMoveDirectionFromTile(this.destination.x, this.destination.y, this.moveIntention) &&
                    this.moveIntention !== this.lastMove) {
                this.changeDirectionAndContinueMoving(this.moveIntention);
            }
            // Not moving, but wanting to, so start!
            else if(!this.isMoving() && this.moveIntention &&
                    this.canMoveDirectionFromCurrentTile(this.moveIntention)) {
                this.startMoving(this.moveIntention);
            }
        }
    },

    getCurrentTile: function() {
        return { x: this.xCoord, y: this.yCoord };
    },

    getTileAdjacentToTile: function(tileX, tileY, direction) {
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
    },

    startMoving: function(direction) {
        var currTile = this.getCurrentTile();
        this.destination = this.getTileAdjacentToTile(currTile.x, currTile.y, direction);
        this.lastMove = direction;
    },

    continueMovingFromDestination: function() {
        this.snapToTile(this.destination.x, this.destination.y);
        this.destination = null;
    },

    changeDirectionAndContinueMoving: function(newDirection) {
        this.snapToTile(this.destination.x, this.destination.y);
        this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, newDirection);
        this.lastMove = newDirection;
    },

    stopMoving: function() {
        this.snapToTile(this.destination.x, this.destination.y);
        this.destination = null;
        this.player.body.velocity.x = this.player.body.velocity.y = 0;
    },

    snapToTile: function(x, y) {
        this.isSnapping = true;
        var tween = this.game.add.tween(this.player).to({ x: x * tileSize + backgroundX, 
                                                          y: y * tileSize + backgroundY}, 
                                                          tweenTime, 
                                                          Phaser.Easing.Linear.None, 
                                                          true);
        tween.onComplete.add(this.stopSnap, this);
    },

    justReachedDestination: function() {
        var result = (
            (this.xCoord == this.destination.x) || 
            (this.yCoord == this.destination.y)
        );
        return result;
    },

    isMoving: function() {
        return this.destination !== null;
    },

    canMoveDirectionFromTile: function(tileX, tileY, direction) {
        var newPos = this.getTileAdjacentToTile(tileX, tileY, direction);
        var tile = (this.map.getTile(newPos.x, newPos.y, this.obstacles));
        console.log(tile);
        if (tile) {
            return !(this.map.collideIndexes.indexOf(tile.index) != -1);
        } else {
            return true;
        }
    },

    canMoveDirectionFromCurrentTile: function(direction) {
        var currTile = this.getCurrentTile();
        return this.canMoveDirectionFromTile(currTile.x, currTile.y, direction);
    },

    stopSnap: function() {
        this.isSnapping = false;
    }

};
var moveType = {
    'UP': 1,
    'DOWN': 2,
    'LEFT': 4,
    'RIGHT': 8
};




var playerSpeed = 1;
var tileSize = 32;
var backgroundX = 160;
var backgroundY = 220;

function Level1Risky() {
    this.player;
    this.chairs;
    this.cursors;
    this.xCoord;
    this.yCoord;
    this.destination;
    this.size = { x: 32, y: 32 };
    this.speed = playerSpeed;
    this.moveIntention;
    this.isSnapping;
};

Level1Risky.prototype = {
    preload: function() {
        console.log("Risky but Rewarding");
        this.game.load.image('background', 'assets/images/map1.png');
        this.game.load.image('chair', 'assets/images/risky_chair.png');
        this.game.load.image('tree', 'assets/images/risky_tree.png');
        this.game.load.image('player', 'assets/images/playersprite.png');
        // load all game assets
        // images, spritesheets, atlases, audio etc..
    },

    // var chairs;
    create: function() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.game.add.sprite(backgroundX, backgroundY, 'background');
        
        this.chairs = this.game.add.group();
        this.chairs.enableBody = true;
        var chair = this.chairs.create(backgroundX + 1 * 32, backgroundY + 4, 'chair');
        chair.body.immovable = true;
        chair = this.chairs.create(backgroundX + 3 * 32, backgroundY + 4, 'chair');
        chair.body.immovable = true;


        this.player = this.game.add.sprite(backgroundX, backgroundY + 2 * 32, 'player');
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.destination = null;

    },
    update: function() {

        this.game.physics.arcade.collide(this.player, this.chairs);

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
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention) {
                this.stopMoving();
            }
            // Destination reached, but set new destination and keep going.
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                    this.moveIntention === this.lastMove) {
                this.continueMovingFromDestination();
            }
            // Destination reached, but changing direction and continuing.
            else if(this.isMoving() && this.justReachedDestination() && this.moveIntention &&
                    this.moveIntention !== this.lastMove) {
                this.changeDirectionAndContinueMoving(this.moveIntention);
            }
            // Destination not yet reached, so keep going.
            else if(this.isMoving() && !this.justReachedDestination()) {
                this.continueMovingToDestination();
            }
            // Not moving, but wanting to, so start!
            else if(!this.isMoving() && this.moveIntention) {
                this.startMoving(this.moveIntention);
            }
        }
    },

    getCurrentTile: function() {
        return { x: this.xCoord, y: this.yCoord };
    },

    getTileAdjacentToTile: function(tileX, tileY, direction) {
        if(direction === moveType.UP) tileY += -1;
        else if(direction === moveType.DOWN) tileY += 1;
        else if(direction === moveType.LEFT) tileX += -1;
        else if(direction === moveType.RIGHT) tileX += 1;
        return { x: tileX, y: tileY };
    },

    startMoving: function(direction) {
        // Get current tile position.
        var currTile = this.getCurrentTile();
        // Get new destination.
        this.destination = this.getTileAdjacentToTile(currTile.x, currTile.y, direction);

        // Move.
        this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
        // Remember this move for later.
        this.lastMove = direction;
    },

    continueMovingToDestination: function() {
        this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
    },

    continueMovingFromDestination: function() {
        this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, this.lastMove);
        this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
    },

    changeDirectionAndContinueMoving: function(newDirection) {
        this.snapToTile(this.destination.x, this.destination.y);
        this.destination = this.getTileAdjacentToTile(this.destination.x, this.destination.y, newDirection);
        this.setVelocityByTile(this.destination.x, this.destination.y, this.speed);
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
                                                          320, 
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

    // Sets the velocity of the entity so that it will move toward the tile.
    setVelocityByTile: function(tileX, tileY, velocity) {
        this.player.body.velocity.x = this.player.body.velocity.y = 0;
        if(this.xCoord > tileX) this.player.body.velocity.x = -velocity;
        else if(this.xCoord < tileX) this.player.body.velocity.x = velocity;
        else if(this.yCoord > tileY) this.player.body.velocity.y = -velocity;
        else if(this.yCoord < tileY) this.player.body.velocity.y = velocity;
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




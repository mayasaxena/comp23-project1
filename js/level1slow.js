var tileSize = 32;
var backgroundX = 0;
var backgroundY = 0;
var doorPlaceholder = 10;

function Level1Slow() {}

Level1Slow.prototype = {
    preload: function() {
        console.log("Slow");
        this.game.load.tilemap('slowRoom', 'assets/tilemaps/maps/slow_tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.audio('slowBackground', 'assets/audio/slow_music.mp3');
    },

    create: function() {
        var level1Data = JSON.parse(localStorage.getItem(this.game.state.current));
        if (level1Data) {
            this.startX = level1Data.x;
            this.startY = level1Data.y;
            
        } else {
            this.startX = 1;
            this.startY = 7;
        }
        //music
        music = this.game.add.audio('slowBackground');
        music.play();

        this.map = this.game.add.tilemap('slowRoom');
        this.map.addTilesetImage('slow_tileset', 'slow_tiles');

        this.floors = this.map.createLayer("Floor");
        this.obstacles = this.map.createLayer("Collisions");

        this.map.setCollisionByExclusion([17], true, this.obstacles);

        this.player = new Player(this.game, this.startX * tileSize, this.startY * tileSize);
        this.player.map = this.map;
        this.player.obstacles = this.obstacles;

        this.player.handleDoor = this.handleDoor;
        this.player.handleFile = this.handleFile;

        var openDoors = JSON.parse(localStorage.getItem(this.game.state.current + "Doors"));
        if (openDoors) {
            for (var i = 0; i < openDoors.length; i++) {
                var doorPos = openDoors[i].split(',');
                this.map.putTile(10, doorPos[0], doorPos[1], this.obstacles);
                // Lay duplicate tiles so one collides and one goes over player
                this.map.putTile(10, doorPos[0], doorPos[1], this.overhead);
            };
        }

        this.game.camera.bounds = null;
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);
        this.game.renderer.renderSession.roundPixels = true;

        var graphics = this.game.add.graphics(0, 0);
        graphics.beginFill(0x000000);
        graphics.drawRect(0, 0, this.game.width * 2, this.game.height);
        graphics.alpha = 1;
        graphics.endFill();
        var tween = this.game.add.tween(graphics).to({ alpha: 0 }, 500);
        tween.start();
    },

    // handleDoor is a Player function so 'this' is the player object
    handleDoor: function(doorX, doorY, goingIn, open) {
        //the only door in level1slow wins the game
        var state = "Win";
        if (goingIn && !open) {
            console.log("going in and win");
            var newDoor = new Door(this.game, doorX * tileSize + backgroundX, doorY * tileSize + backgroundY);
            newDoor.open();
            console.log("placeholder");
            // Put down placeholder tile to prevent movement onto door while opening
            this.map.putTile(5, doorX, doorY, this.obstacles);
            // Remove door obstacle so player can go through
            newDoor.events.onAnimationComplete.add(function() {
                this.map.removeTile(doorX, doorY, this.obstacles);
                this.goThroughDoor(doorX, doorY, state, goingIn);
            }, this);
        } else {
            if (!goingIn) {
                state = 'Lobby';
            }
            this.goThroughDoor(doorX, doorY, state, goingIn);
        }
    },

    handleFile: function(oldPos, newPos) {
        var newFile = new File(this.game, oldPos.x * tileSize, oldPos.y * tileSize);
        this.map.removeTile(oldPos.x, oldPos.y, this.obstacles);
        
        var tween = newFile.move(newPos.x, newPos.y);
        if (tween) { 
            tween.onComplete.add(function() {
                // Remove filing cabinet sprite
                newFile.kill();
                // Replace with tile so can continue colliding
                this.map.putTile(fileIndex, newPos.x, newPos.y, this.obstacles);
            }, this);
        }
    }
};
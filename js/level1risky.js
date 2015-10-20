var tileSize = 32;
var backgroundX = 0;
var backgroundY = 0;
var musicPlaying = false;

function Level1Risky() {}

Level1Risky.prototype = {
    preload: function() {
        console.log("Risky but Rewarding");
        this.game.load.tilemap('hallway', 'assets/tilemaps/maps/risky.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.audio('riskyBackground', 'assets/audio/risky_music.mp3');
    },

    create: function() {
        var level1Data = JSON.parse(localStorage.getItem(this.game.state.current));
        if (level1Data) {
            this.startX = level1Data.x;
            this.startY = level1Data.y;
            this.facing = level1Data.facing;
            
        } else {
            this.startX = 4;
            this.startY = 8;
            this.facing = facingForwardIndex;
        }
        //prevent music from layering when reentering level
        if(musicPlaying == false){
            music = this.game.add.audio('riskyBackground');
            music.play();
            musicPlaying = true;
        }
        

        this.map = this.game.add.tilemap('hallway');
        this.map.addTilesetImage('risky_tileset', 'tiles');

        this.floors = this.map.createLayer("Floor");
        this.objects = this.map.createLayer("Objects");
        this.obstacles = this.map.createLayer("Collisions");

        this.map.setCollisionByExclusion([], true, this.obstacles);

        this.player = new Player(this.game, this.startX * tileSize, this.startY * tileSize, this.facing);
        this.player.map = this.map
        this.player.obstacles = this.obstacles;
        this.player.handleDoor = this.handleDoor;

        // Create layer after player so it renders above
        this.overhead = this.map.createLayer("Roof");

        this.doors = [];
        for (var i = 0; i < this.map.layers[2].data.length; i++) {
            var filtered = this.map.layers[2].data[i].filter(function(tile) {
                if (tile.index == doorIndex) {
                    return true;
                }
                return false;
            });
            this.doors = this.doors.concat(filtered);
        }

        this.doors = this.doors.map(function(tile) {
            return "x: " + tile.x + ", y: " + tile.y;
        });
        
        this.player.doors = this.doors;
        
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
        var state = "Office";
        if (goingIn && !open) {
            var doorPos = "x: " + doorX + ", y: " + doorY;
            var doorNum = this.doors.indexOf(doorPos);
            
            var newDoor = new Door(this.game, doorX * tileSize + backgroundX, doorY * tileSize + backgroundY);
            newDoor.open();
            // Put down placeholder tile to prevent movement onto door while opening
            this.map.putTile(11, doorX, doorY, this.obstacles);
            // Remove door obstacle so player can go through
            newDoor.events.onAnimationComplete.add(function() {
                this.map.removeTile(doorX, doorY, this.obstacles);
                this.goThroughDoor(doorX, doorY, state, goingIn, doorNum);
            }, this);
        } else {
            if (!goingIn) {
                state = 'Lobby';
            }
            this.goThroughDoor(doorX, doorY, state, goingIn);
        }
    }
};

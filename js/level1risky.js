var tileSize = 32;
var tweenTime = 250;
var backgroundX = 0;
var backgroundY = 0;

function Level1Risky() {};

Level1Risky.prototype = {
    preload: function() {
        console.log("Risky but Rewarding");
        this.game.load.image('tree', 'assets/images/risky_tree.png');
        this.game.load.image('player', 'assets/images/playersprite.png');
        this.game.load.spritesheet('door_animation', 'assets/images/animation/risky_door_animation.png', 32, 32);


        this.game.load.tilemap('background', 'assets/tilemaps/maps/risky.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/risky_tileset.png');
    },

    create: function() {
        this.map = this.game.add.tilemap('background');
        this.map.addTilesetImage('risky_tileset', 'tiles');

        this.floors = this.map.createLayer("Floor");
        this.objects = this.map.createLayer("Objects");
        this.obstacles = this.map.createLayer("Collisions");

        this.map.setCollisionByExclusion([], true, this.obstacles);

        this.player = new Player(this.game, tileSize, tileSize * 3);
        this.player.map = this.map
        this.player.obstacles = this.obstacles;
        this.player.handleDoor = this.handleDoor;

        this.game.camera.bounds = null;
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);
        this.game.renderer.renderSession.roundPixels = true
    },

    update: function() {
    },

    handleDoor: function(doorX, doorY) {
        var newDoor = new Door(this.game, doorX * tileSize + backgroundX, doorY * tileSize + backgroundY);
        newDoor.open();
        // Put down placeholder tile to prevent movement onto door while opening
        this.map.putTile(11, doorX, doorY, this.obstacles);
        // Remove door obstacle so player can go through
        newDoor.events.onAnimationComplete.add(function() {
            this.map.removeTile(doorX, doorY, this.obstacles);
        }, this);
    }

};

var tileSize = 32;
var tweenTime = 250;
var backgroundX = 0;
var backgroundY = 0;

function Level1Slow() {};

Level1Risky.prototype = {
    preload: function() {
        console.log("Slow and steady");
        this.game.load.image('player', 'assets/images/playersprite.png');

        this.game.load.tilemap('background', 'assets/tilemaps/maps/slow.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tilemaps/tiles/slow_tileset.png');
    },

    create: function() {
        this.map = this.game.add.tilemap('background');
        this.map.addTilesetImage('slow_tileset', 'tiles');
    
        this.floors = this.map.createLayer("Floor");
        this.filecab = this.map.createLayer("File cabinets");
        this.obstacles = this.map.createLayer("Walls");

        this.map.setCollisionByExclusion([], true, this.obstacles);

        this.player = new Player(this.game, tileSize, tileSize * 3);
        this.player.map = this.map;
        this.player.obstacles = this.obstacles;
        this.player.handleDoor = this.handleDoor;

        this.game.camera.bounds = null;
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);
        this.game.renderer.renderSession.roundPixels = true

        //this.map.setCollision(0, true, this.obstacles);

        this.player = new Player(this.game, this.map, this.obstacles, 0, tileSize * 2);
    }
};



